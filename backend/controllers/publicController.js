const pageModel = require('../models/pageModel');
const serviceModel = require('../models/serviceModel');
const productModel = require('../models/productModel');
const projectModel = require('../models/projectModel');
const blogModel = require('../models/blogModel');
const leadModel = require('../models/leadModel');
const jobModel = require('../models/jobModel');
const applicationModel = require('../models/applicationModel');
const seoModel = require('../models/seoModel');
const settingsModel = require('../models/settingsModel');
const teamModel = require('../models/teamModel');
const env = require('../config/env');
const { generateSitemapXml } = require('../services/sitemapService');
const { sendLeadAlert, sendLeadConfirmation, sendApplicationAlert } = require('../services/emailService');
const { sanitizePlainText, sanitizeRichText } = require('../utils/content');
const {
  excerpt,
  resolveServiceProfile,
  getHomeContent,
  getServicesPageContent,
  getProductsPageContent,
  getProjectsPageContent,
  getBlogPageContent,
  getCareersPageContent,
  getContactPageContent,
  getAboutPageContent,
  getTeamPageContent
} = require('../services/siteContentService');

function firstNonEmpty(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return null;
}

function firstImage(...values) {
  for (const value of values) {
    if (Array.isArray(value)) {
      const match = value.find(Boolean);
      if (match) {
        return match;
      }

      continue;
    }

    if (value) {
      return value;
    }
  }

  return null;
}

function buildSeo(defaults, overrides = {}) {
  return {
    metaTitle: firstNonEmpty(overrides.metaTitle, defaults?.meta_title, 'Kuwexa Private Limited'),
    metaDescription: firstNonEmpty(overrides.metaDescription, defaults?.meta_description, 'Kuwexa Private Limited builds scalable systems for global commerce.'),
    metaKeywords: firstNonEmpty(overrides.metaKeywords, defaults?.meta_keywords),
    metaRobots: firstNonEmpty(overrides.metaRobots, defaults?.meta_robots),
    ogType: firstNonEmpty(overrides.ogType, defaults?.og_type, 'website'),
    ogTitle: firstNonEmpty(overrides.ogTitle, defaults?.og_title, overrides.metaTitle, defaults?.meta_title, 'Kuwexa Private Limited'),
    ogDescription: firstNonEmpty(overrides.ogDescription, defaults?.og_description, overrides.metaDescription, defaults?.meta_description, 'Kuwexa Private Limited builds scalable systems for global commerce.'),
    ogImage: firstNonEmpty(overrides.ogImage, defaults?.og_image),
    ogImageAlt: firstNonEmpty(overrides.ogImageAlt, defaults?.og_image_alt),
    twitterCard: firstNonEmpty(overrides.twitterCard, defaults?.twitter_card),
    twitterTitle: firstNonEmpty(overrides.twitterTitle, defaults?.twitter_title, overrides.ogTitle, defaults?.og_title, overrides.metaTitle, defaults?.meta_title),
    twitterDescription: firstNonEmpty(overrides.twitterDescription, defaults?.twitter_description, overrides.ogDescription, defaults?.og_description, overrides.metaDescription, defaults?.meta_description),
    twitterImage: firstNonEmpty(overrides.twitterImage, defaults?.twitter_image, overrides.ogImage, defaults?.og_image),
    canonicalUrl: firstNonEmpty(overrides.canonicalUrl, defaults?.canonical_url),
    schemaMarkup: firstNonEmpty(overrides.schemaMarkup, defaults?.schema_markup),
    breadcrumbs: overrides.breadcrumbs || null,
    faqItems: overrides.faqItems || null,
    publishedTime: overrides.publishedTime || null,
    modifiedTime: overrides.modifiedTime || null,
    authorName: overrides.authorName || null
  };
}

function absoluteUrl(pathname = '/') {
  const base = String(env.appUrl || '').replace(/\/$/, '');
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${normalizedPath}`;
}

function buildBreadcrumbs(...items) {
  return items
    .flat()
    .filter(Boolean)
    .map((item) => ({
      name: item.name,
      path: item.path
    }));
}

function normalizeSchemaMarkup(...values) {
  const items = [];

  values.forEach((value) => {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      items.push(...normalizeSchemaMarkup(...value));
      return;
    }

    items.push(value);
  });

  return items.length ? items : null;
}

function buildServiceSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.meta_description || service.short_description || excerpt(service.description || '', 220),
    provider: {
      '@type': 'Organization',
      name: 'Kuwexa Private Limited',
      url: absoluteUrl('/')
    },
    serviceType: service.category || service.title,
    url: absoluteUrl(`/services/${service.slug}`),
    image: service.image ? absoluteUrl(service.image) : undefined
  };
}

function buildProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.meta_description || product.short_description || excerpt(product.description || '', 220),
    image: firstImage(product.logo, product.images) ? absoluteUrl(firstImage(product.logo, product.images)) : undefined,
    brand: {
      '@type': 'Brand',
      name: 'Kuwexa'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Kuwexa Private Limited',
      url: absoluteUrl('/')
    },
    url: absoluteUrl(`/products/${product.slug}`)
  };
}

function buildProjectSchema(project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    headline: project.title,
    description: project.meta_description || project.short_description || project.summary,
    image: firstImage(project.featured_image, project.images) ? absoluteUrl(firstImage(project.featured_image, project.images)) : undefined,
    author: {
      '@type': 'Organization',
      name: 'Kuwexa Private Limited'
    },
    url: absoluteUrl(`/portfolio/${project.slug}`)
  };
}

function buildArticleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta_description || post.excerpt || post.summary,
    image: post.featured_image ? absoluteUrl(post.featured_image) : undefined,
    author: {
      '@type': 'Person',
      name: post.author_name || 'Kuwexa Editorial Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kuwexa Private Limited',
      url: absoluteUrl('/')
    },
    datePublished: post.published_at || post.created_at || undefined,
    dateModified: post.updated_at || post.published_at || post.created_at || undefined,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`)
  };
}

function buildPersonSchema(member) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.designation,
    description: member.meta_description || member.short_bio || member.designation,
    image: member.image ? absoluteUrl(member.image) : undefined,
    email: member.email || undefined,
    telephone: member.phone || undefined,
    worksFor: {
      '@type': 'Organization',
      name: 'Kuwexa Private Limited',
      url: absoluteUrl('/')
    },
    sameAs: [member.linkedin_url, member.twitter_url, member.facebook_url].filter(Boolean),
    url: absoluteUrl(`/team/${member.slug}`)
  };
}

function buildJobSchema(job) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.created_at || undefined,
    employmentType: job.employment_type || undefined,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Kuwexa Private Limited',
      url: absoluteUrl('/')
    },
    jobLocationType: job.location && /remote/i.test(job.location) ? 'TELECOMMUTE' : undefined,
    applicantLocationRequirements: job.location || undefined
  };
}

function isProductsEnabled(res) {
  if (typeof res.locals.showProductsMenu === 'boolean') {
    return res.locals.showProductsMenu;
  }

  return Number(res.locals.siteSettings?.show_products_menu) !== 0;
}

async function home(req, res) {
  const showProducts = isProductsEnabled(res);
  const [seoRecord, services, products, projects, posts, jobs] = await Promise.all([
    seoModel.findByPageKey('home'),
    serviceModel.listFeatured(4),
    showProducts ? productModel.listFeatured(3) : Promise.resolve([]),
    projectModel.listFeatured(6),
    blogModel.latest(3),
    jobModel.listOpen()
  ]);
  const marketing = getHomeContent({ services, products, projects, posts, jobs });

  return res.render('frontend/pages/home', {
    title: 'Kuwexa Private Limited',
    services: services.map((service) => ({
      ...service,
      profile: resolveServiceProfile(service)
    })),
    products,
    projects: projects.map((project) => ({
      ...project,
      summary: project.short_description || excerpt(project.description || project.results, 150)
    })),
    posts: posts.map((post) => ({
      ...post,
      summary: post.excerpt || excerpt(post.content, 170)
    })),
    jobs: jobs.slice(0, 3),
    marketing,
    seo: buildSeo(seoRecord, {
      metaTitle: 'Kuwexa Private Limited | Systems for Scalable Global Commerce',
      metaDescription: marketing.heroSubtitle,
      canonicalUrl: '/',
      breadcrumbs: buildBreadcrumbs({ name: 'Home', path: '/' }),
      faqItems: marketing.faqs
    })
  });
}

async function services(req, res) {
  const [seoRecord, items] = await Promise.all([
    seoModel.findByPageKey('services'),
    serviceModel.listPublished()
  ]);
  const pageContent = getServicesPageContent(items);

  return res.render('frontend/pages/services', {
    title: 'Services',
    services: items.map((service) => ({
      ...service,
      profile: resolveServiceProfile(service)
    })),
    pageContent,
    seo: buildSeo(seoRecord, {
      metaTitle: 'Capabilities | Kuwexa Private Limited',
      metaDescription: 'Explore Kuwexa capabilities across digital innovation, ecommerce enablement, and business technology delivery.',
      canonicalUrl: '/services',
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Capabilities', path: '/services' }
      ),
      faqItems: pageContent.faqs
    })
  });
}

async function serviceDetail(req, res, next) {
  const service = await serviceModel.findBySlug(req.params.slug);
  if (!service) {
    return next();
  }

  return res.render('frontend/pages/service-detail', {
    title: service.title,
    service,
    profile: resolveServiceProfile(service),
    seo: buildSeo(null, {
      metaTitle: service.meta_title || `${service.title} | Kuwexa Capability`,
      metaDescription: service.meta_description || service.short_description,
      metaKeywords: service.meta_keywords,
      schemaMarkup: normalizeSchemaMarkup(service.schema_markup, buildServiceSchema(service)),
      ogImage: service.image,
      ogImageAlt: service.title ? `${service.title} service image` : null,
      twitterImage: service.image,
      canonicalUrl: `/services/${service.slug}`,
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Capabilities', path: '/services' },
        { name: service.title, path: `/services/${service.slug}` }
      )
    })
  });
}

async function products(req, res, next) {
  if (!isProductsEnabled(res)) {
    return next();
  }

  const [seoRecord, items] = await Promise.all([
    seoModel.findByPageKey('products'),
    productModel.listPublished()
  ]);
  const pageContent = getProductsPageContent(items);

  return res.render('frontend/pages/products', {
    title: 'Platforms',
    products: items,
    pageContent,
    seo: buildSeo(seoRecord, {
      metaTitle: 'Platforms | Kuwexa Private Limited',
      metaDescription: 'Explore software platforms, digital products, and managed ecosystem tools developed within Kuwexa.',
      canonicalUrl: '/products'
      ,
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Platforms', path: '/products' }
      )
    })
  });
}

async function productDetail(req, res, next) {
  if (!isProductsEnabled(res)) {
    return next();
  }

  const product = await productModel.findBySlug(req.params.slug);
  if (!product || product.status !== 'published') {
    return next();
  }

  return res.render('frontend/pages/product-detail', {
    title: product.name,
    product,
    seo: buildSeo(null, {
      metaTitle: product.meta_title || `${product.name} | Kuwexa Platform`,
      metaDescription: product.meta_description || product.short_description,
      metaKeywords: product.meta_keywords,
      ogType: 'product',
      schemaMarkup: buildProductSchema(product),
      ogImage: firstImage(product.logo, product.images),
      ogImageAlt: product.name ? `${product.name} product preview` : null,
      twitterImage: firstImage(product.logo, product.images),
      canonicalUrl: `/products/${product.slug}`,
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Platforms', path: '/products' },
        { name: product.name, path: `/products/${product.slug}` }
      )
    })
  });
}

async function projects(req, res) {
  const [seoRecord, items] = await Promise.all([
    seoModel.findByPageKey('projects'),
    projectModel.listPublished()
  ]);
  const pageContent = getProjectsPageContent(items);

  return res.render('frontend/pages/projects', {
    title: 'Initiatives',
    projects: items.map((project) => ({
      ...project,
      summary: project.short_description || excerpt(project.description || project.results, 150)
    })),
    pageContent,
    seo: buildSeo(seoRecord, {
      metaTitle: 'Initiatives | Kuwexa Private Limited',
      metaDescription: 'See Kuwexa initiatives, delivery stories, and platform execution work across commerce and digital systems.',
      canonicalUrl: '/portfolio',
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Initiatives', path: '/portfolio' }
      )
    })
  });
}

async function projectDetail(req, res, next) {
  const project = await projectModel.findBySlug(req.params.slug);
  if (!project || project.status !== 'published') {
    return next();
  }

  return res.render('frontend/pages/project-detail', {
    title: project.title,
    project: {
      ...project,
      summary: project.short_description || excerpt(project.description || project.results, 180)
    },
    seo: buildSeo(null, {
      metaTitle: project.meta_title || `${project.title} | Kuwexa Initiative`,
      metaDescription: project.meta_description || project.short_description || project.category,
      metaKeywords: project.meta_keywords,
      schemaMarkup: buildProjectSchema(project),
      ogImage: firstImage(project.featured_image, project.images),
      ogImageAlt: project.title ? `${project.title} featured image` : null,
      twitterImage: firstImage(project.featured_image, project.images),
      canonicalUrl: `/portfolio/${project.slug}`,
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Initiatives', path: '/portfolio' },
        { name: project.title, path: `/portfolio/${project.slug}` }
      )
    })
  });
}

async function blog(req, res) {
  const [seoRecord, posts] = await Promise.all([
    seoModel.findByPageKey('blog'),
    blogModel.listPublished()
  ]);
  const pageContent = getBlogPageContent(posts);

  return res.render('frontend/pages/blog', {
    title: 'Blog',
    posts: posts.map((post) => ({
      ...post,
      summary: post.excerpt || excerpt(post.content, 170)
    })),
    pageContent,
    seo: buildSeo(seoRecord, {
      metaTitle: 'Insights | Kuwexa Private Limited',
      metaDescription: 'Insights on hybrid commerce, digital systems, operations, and scalable growth.',
      canonicalUrl: '/blog',
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Insights', path: '/blog' }
      )
    })
  });
}

async function blogDetail(req, res, next) {
  const post = await blogModel.findBySlug(req.params.slug);
  if (!post || post.status !== 'published') {
    return next();
  }

  return res.render('frontend/pages/blog-detail', {
    title: post.title,
    post: {
      ...post,
      summary: post.excerpt || excerpt(post.content, 170)
    },
    seo: buildSeo(null, {
      metaTitle: post.meta_title || post.title,
      metaDescription: post.meta_description || post.excerpt,
      metaKeywords: post.meta_keywords,
      ogType: 'article',
      ogTitle: post.og_title || post.title,
      ogDescription: post.og_description || post.excerpt,
      ogImage: post.featured_image,
      ogImageAlt: post.title ? `${post.title} featured image` : null,
      twitterCard: post.featured_image ? 'summary_large_image' : null,
      twitterImage: post.featured_image,
      canonicalUrl: post.canonical_url || `/blog/${post.slug}`,
      schemaMarkup: normalizeSchemaMarkup(post.schema_markup, buildArticleSchema(post)),
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Insights', path: '/blog' },
        { name: post.title, path: `/blog/${post.slug}` }
      ),
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      authorName: post.author_name || 'Kuwexa Editorial Team'
    })
  });
}

async function careers(req, res) {
  const [seoRecord, jobs] = await Promise.all([
    seoModel.findByPageKey('careers'),
    jobModel.listOpen()
  ]);
  const pageContent = getCareersPageContent(jobs);

  return res.render('frontend/pages/careers', {
    title: 'Careers',
    jobs,
    pageContent,
    seo: buildSeo(seoRecord, {
      metaTitle: 'Careers | Kuwexa Private Limited',
      metaDescription: 'Join Kuwexa Private Limited and help build scalable commerce, digital platforms, and operational systems.',
      canonicalUrl: '/careers',
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Careers', path: '/careers' }
      ),
      faqItems: pageContent.faqs
    })
  });
}

async function jobDetail(req, res, next) {
  const job = await jobModel.findBySlug(req.params.slug);
  if (!job || job.status !== 'open') {
    return next();
  }

  return res.render('frontend/pages/job-detail', {
    title: job.title,
    job,
    pageContent: getCareersPageContent([job]),
    seo: buildSeo(null, {
      metaTitle: job.meta_title || `${job.title} | Careers at Kuwexa`,
      metaDescription: job.meta_description || job.location,
      metaKeywords: job.meta_keywords,
      canonicalUrl: `/careers/${job.slug}`,
      schemaMarkup: buildJobSchema(job),
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Careers', path: '/careers' },
        { name: job.title, path: `/careers/${job.slug}` }
      )
    }),
    applied: req.query.applied || null
  });
}

async function contact(req, res) {
  const seoRecord = await seoModel.findByPageKey('contact');

  return res.render('frontend/pages/contact', {
    title: 'Contact',
    sent: req.query.sent || null,
    pageContent: getContactPageContent(),
    seo: buildSeo(seoRecord, {
      metaTitle: 'Contact Kuwexa Private Limited',
      metaDescription: 'Start a conversation with Kuwexa about trade enablement, digital platforms, or growth systems.',
      canonicalUrl: '/contact',
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' }
      ),
      faqItems: getContactPageContent().faqs
    })
  });
}

async function about(req, res) {
  const [seoRecord, teamShowcase] = await Promise.all([
    seoModel.findByPageKey('about'),
    teamModel.listGroupedActive()
  ]);

  return res.render('frontend/pages/about', {
    title: 'About Kuwexa',
    pageContent: getAboutPageContent(),
    teamShowcase,
    seo: buildSeo(seoRecord, {
      metaTitle: 'About Kuwexa Private Limited | Hybrid Commerce and Digital Innovation',
      metaDescription: 'Learn how Kuwexa Private Limited connects global trade, consumer commerce, and digital innovation through a hybrid operating model.',
      canonicalUrl: '/about-us'
      ,
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'About Kuwexa', path: '/about-us' }
      )
    })
  });
}

async function team(req, res) {
  const [seoRecord, teamShowcase] = await Promise.all([
    seoModel.findByPageKey('team'),
    teamModel.listGroupedActive()
  ]);

  return res.render('frontend/pages/team', {
    title: 'Leadership',
    pageContent: getTeamPageContent(teamShowcase),
    teamShowcase,
    seo: buildSeo(seoRecord, {
      metaTitle: 'Leadership | Kuwexa Private Limited',
      metaDescription: 'Meet the leadership and team guiding Kuwexa Private Limited and its operating ecosystem.',
      canonicalUrl: '/team'
      ,
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Leadership', path: '/team' }
      )
    })
  });
}

async function teamProfile(req, res, next) {
  const member = await teamModel.findBySlug(req.params.slug);
  if (!member || member.status !== 'active') {
    return next();
  }

  return res.render('frontend/pages/team-detail', {
    title: member.name,
    member,
    seo: buildSeo(null, {
      metaTitle: member.meta_title || `${member.name} | ${member.designation} | Kuwexa Private Limited`,
      metaDescription: member.meta_description || member.short_bio || `${member.name} serves as ${member.designation} at Kuwexa Private Limited.`,
      metaKeywords: member.meta_keywords,
      ogType: 'profile',
      schemaMarkup: buildPersonSchema(member),
      ogImage: member.image,
      ogImageAlt: member.name ? `${member.name} portrait` : null,
      twitterImage: member.image,
      canonicalUrl: `/team/${member.slug}`,
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: 'Leadership', path: '/team' },
        { name: member.name, path: `/team/${member.slug}` }
      )
    })
  });
}

async function pageDetail(req, res, next) {
  const page = await pageModel.findBySlug(req.params.slug);
  if (!page || page.status !== 'published') {
    return next();
  }

  return res.render('frontend/pages/page', {
    title: page.title,
    page,
    seo: buildSeo(null, {
      metaTitle: page.meta_title || page.title,
      metaDescription: page.meta_description || page.title,
      metaKeywords: page.meta_keywords,
      ogTitle: page.og_title || page.title,
      ogDescription: page.og_description || page.meta_description,
      canonicalUrl: page.canonical_url || `/${page.slug}`,
      schemaMarkup: page.schema_markup,
      breadcrumbs: buildBreadcrumbs(
        { name: 'Home', path: '/' },
        { name: page.title, path: page.canonical_url || `/${page.slug}` }
      )
    })
  });
}

async function submitLead(req, res) {
  const payload = {
    name: sanitizePlainText(req.body.name),
    email: sanitizePlainText(req.body.email),
    phone: sanitizePlainText(req.body.phone),
    message: sanitizePlainText(req.body.message),
    source: sanitizePlainText(req.body.source) || 'Website Contact Form'
  };

  const lead = await leadModel.createLead(payload);
  await Promise.allSettled([
    sendLeadAlert(lead),
    sendLeadConfirmation(lead)
  ]);

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(201).json({ message: 'Lead submitted successfully.', lead });
  }

  return res.redirect('/contact?sent=Your%20message%20has%20been%20received.');
}

async function submitApplication(req, res) {
  const job = req.params.slug
    ? await jobModel.findBySlug(req.params.slug)
    : await jobModel.findBySlug(req.body.job_slug);

  if (!job) {
    const error = 'Job opening not found.';
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(404).json({ message: error });
    }

    return res.redirect('/careers');
  }

  const payload = {
    job_id: job.id,
    name: sanitizePlainText(req.body.name),
    email: sanitizePlainText(req.body.email),
    phone: sanitizePlainText(req.body.phone),
    resume: req.file ? `/uploads/resumes/${req.file.filename}` : sanitizePlainText(req.body.resume),
    cover_letter: sanitizeRichText(req.body.cover_letter)
  };

  const application = await applicationModel.createApplication(payload);
  await sendApplicationAlert(application, job.title).catch(() => {});

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(201).json({ message: 'Application submitted successfully.', application });
  }

  return res.redirect(`/careers/${job.slug}?applied=Application%20submitted%20successfully.`);
}

async function sitemap(req, res) {
  const xml = await generateSitemapXml();
  res.type('application/xml');
  return res.send(xml);
}

async function robots(req, res) {
  const settings = res.locals.siteSettings || await settingsModel.getSettings().catch(() => null);
  const hostUrl = `${req.protocol}://${req.get('host')}`;
  const fallback = 'User-agent: *\nAllow: /';
  let content = String(settings?.robots_txt || fallback).trim();

  if (!content) {
    content = fallback;
  }

  content = content.replace(/\{APP_URL\}/g, hostUrl);

  if (!/sitemap:/i.test(content)) {
    content = `${content}\nSitemap: ${hostUrl}/sitemap.xml`;
  }

  res.type('text/plain');
  return res.send(content);
}

module.exports = {
  home,
  services,
  serviceDetail,
  products,
  productDetail,
  projects,
  projectDetail,
  blog,
  blogDetail,
  careers,
  jobDetail,
  contact,
  about,
  team,
  teamProfile,
  pageDetail,
  submitLead,
  submitApplication,
  sitemap,
  robots
};
