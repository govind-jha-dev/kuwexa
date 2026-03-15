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
    metaTitle: firstNonEmpty(overrides.metaTitle, defaults?.meta_title, 'CodexWebz'),
    metaDescription: firstNonEmpty(overrides.metaDescription, defaults?.meta_description, 'CodexWebz web platform'),
    metaKeywords: firstNonEmpty(overrides.metaKeywords, defaults?.meta_keywords),
    metaRobots: firstNonEmpty(overrides.metaRobots, defaults?.meta_robots),
    ogType: firstNonEmpty(overrides.ogType, defaults?.og_type, 'website'),
    ogTitle: firstNonEmpty(overrides.ogTitle, defaults?.og_title, overrides.metaTitle, defaults?.meta_title, 'CodexWebz'),
    ogDescription: firstNonEmpty(overrides.ogDescription, defaults?.og_description, overrides.metaDescription, defaults?.meta_description, 'CodexWebz web platform'),
    ogImage: firstNonEmpty(overrides.ogImage, defaults?.og_image),
    ogImageAlt: firstNonEmpty(overrides.ogImageAlt, defaults?.og_image_alt),
    twitterCard: firstNonEmpty(overrides.twitterCard, defaults?.twitter_card),
    twitterTitle: firstNonEmpty(overrides.twitterTitle, defaults?.twitter_title, overrides.ogTitle, defaults?.og_title, overrides.metaTitle, defaults?.meta_title),
    twitterDescription: firstNonEmpty(overrides.twitterDescription, defaults?.twitter_description, overrides.ogDescription, defaults?.og_description, overrides.metaDescription, defaults?.meta_description),
    twitterImage: firstNonEmpty(overrides.twitterImage, defaults?.twitter_image, overrides.ogImage, defaults?.og_image),
    canonicalUrl: firstNonEmpty(overrides.canonicalUrl, defaults?.canonical_url),
    schemaMarkup: firstNonEmpty(overrides.schemaMarkup, defaults?.schema_markup)
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

  return res.render('frontend/pages/home', {
    title: 'CodexWebz',
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
    marketing: getHomeContent({ services, products, projects, posts, jobs }),
    seo: buildSeo(seoRecord)
  });
}

async function services(req, res) {
  const [seoRecord, items] = await Promise.all([
    seoModel.findByPageKey('services'),
    serviceModel.listPublished()
  ]);

  return res.render('frontend/pages/services', {
    title: 'Services',
    services: items.map((service) => ({
      ...service,
      profile: resolveServiceProfile(service)
    })),
    pageContent: getServicesPageContent(items),
    seo: buildSeo(seoRecord)
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
      metaTitle: service.meta_title || `${service.title} | CodexWebz`,
      metaDescription: service.meta_description || service.short_description,
      metaKeywords: service.meta_keywords,
      schemaMarkup: service.schema_markup,
      ogImage: service.image,
      twitterImage: service.image,
      canonicalUrl: `/services/${service.slug}`
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

  return res.render('frontend/pages/products', {
    title: 'Our Products',
    products: items,
    pageContent: getProductsPageContent(items),
    seo: buildSeo(seoRecord, {
      canonicalUrl: '/products'
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
      metaTitle: product.meta_title || `${product.name} | CodexWebz Product`,
      metaDescription: product.meta_description || product.short_description,
      metaKeywords: product.meta_keywords,
      ogType: 'product',
      ogImage: firstImage(product.logo, product.images),
      twitterImage: firstImage(product.logo, product.images),
      canonicalUrl: `/products/${product.slug}`
    })
  });
}

async function projects(req, res) {
  const [seoRecord, items] = await Promise.all([
    seoModel.findByPageKey('projects'),
    projectModel.listPublished()
  ]);

  return res.render('frontend/pages/projects', {
    title: 'Client Projects',
    projects: items.map((project) => ({
      ...project,
      summary: project.short_description || excerpt(project.description || project.results, 150)
    })),
    pageContent: getProjectsPageContent(items),
    seo: buildSeo(seoRecord, {
      metaTitle: 'Client Projects | CodexWebz',
      metaDescription: 'Selected CodexWebz client websites, digital builds, and client project case studies.',
      canonicalUrl: '/portfolio'
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
      metaTitle: project.meta_title || `${project.title} | CodexWebz`,
      metaDescription: project.meta_description || project.short_description || project.category,
      metaKeywords: project.meta_keywords,
      ogImage: firstImage(project.featured_image, project.images),
      twitterImage: firstImage(project.featured_image, project.images),
      canonicalUrl: `/portfolio/${project.slug}`
    })
  });
}

async function blog(req, res) {
  const [seoRecord, posts] = await Promise.all([
    seoModel.findByPageKey('blog'),
    blogModel.listPublished()
  ]);

  return res.render('frontend/pages/blog', {
    title: 'Blog',
    posts: posts.map((post) => ({
      ...post,
      summary: post.excerpt || excerpt(post.content, 170)
    })),
    pageContent: getBlogPageContent(posts),
    seo: buildSeo(seoRecord)
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
      twitterCard: post.featured_image ? 'summary_large_image' : null,
      twitterImage: post.featured_image,
      canonicalUrl: post.canonical_url || `/blog/${post.slug}`,
      schemaMarkup: post.schema_markup
    })
  });
}

async function careers(req, res) {
  const [seoRecord, jobs] = await Promise.all([
    seoModel.findByPageKey('careers'),
    jobModel.listOpen()
  ]);

  return res.render('frontend/pages/careers', {
    title: 'Careers',
    jobs,
    pageContent: getCareersPageContent(jobs),
    seo: buildSeo(seoRecord)
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
      metaTitle: job.meta_title || `${job.title} | Careers at CodexWebz`,
      metaDescription: job.meta_description || job.location,
      metaKeywords: job.meta_keywords,
      canonicalUrl: `/careers/${job.slug}`
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
    seo: buildSeo(seoRecord)
  });
}

async function about(req, res) {
  const [seoRecord, teamShowcase] = await Promise.all([
    seoModel.findByPageKey('about'),
    teamModel.listGroupedActive()
  ]);

  return res.render('frontend/pages/about', {
    title: 'About CodexWEBZ',
    pageContent: getAboutPageContent(),
    teamShowcase,
    seo: buildSeo(seoRecord, {
      metaTitle: 'About CodexWEBZ | Technology Services by Kuwexa Private Limited',
      metaDescription: 'Learn how CodexWEBZ, the technology services division of Kuwexa Private Limited, helps businesses build reliable digital systems for growth, efficiency, and scalability.',
      canonicalUrl: '/about-us'
    })
  });
}

async function team(req, res) {
  const [seoRecord, teamShowcase] = await Promise.all([
    seoModel.findByPageKey('team'),
    teamModel.listGroupedActive()
  ]);

  return res.render('frontend/pages/team', {
    title: 'Team',
    pageContent: getTeamPageContent(teamShowcase),
    teamShowcase,
    seo: buildSeo(seoRecord, {
      metaTitle: 'Team | CodexWEBZ',
      metaDescription: 'Meet the leadership and team behind CodexWEBZ and the delivery systems built for business growth.',
      canonicalUrl: '/team'
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
      metaTitle: member.meta_title || `${member.name} | ${member.designation} | CodexWEBZ`,
      metaDescription: member.meta_description || member.short_bio || `${member.name} serves as ${member.designation} at CodexWEBZ.`,
      metaKeywords: member.meta_keywords,
      ogType: 'profile',
      ogImage: member.image,
      twitterImage: member.image,
      canonicalUrl: `/team/${member.slug}`
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
      schemaMarkup: page.schema_markup
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
