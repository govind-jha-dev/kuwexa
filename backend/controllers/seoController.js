const seoModel = require('../models/seoModel');
const settingsModel = require('../models/settingsModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText, parseJsonInput } = require('../utils/content');

const ogTypeOptions = [
  { label: 'Auto / Default', value: '' },
  { label: 'Website', value: 'website' },
  { label: 'Article', value: 'article' },
  { label: 'Profile', value: 'profile' },
  { label: 'Product', value: 'product' },
  { label: 'Business', value: 'business.business' }
];

const twitterCardOptions = [
  { label: 'Auto / Default', value: '' },
  { label: 'Summary', value: 'summary' },
  { label: 'Summary Large Image', value: 'summary_large_image' },
  { label: 'App', value: 'app' },
  { label: 'Player', value: 'player' }
];

function countConfigured(items, predicate) {
  return items.filter(predicate).length;
}

function buildSitewideSeoFields(settings = {}) {
  return [
    {
      name: 'default_meta_title',
      label: 'Default Meta Title',
      type: 'text',
      value: settings.default_meta_title || '',
      description: 'Fallback title used when a page or content record does not provide its own SEO title.'
    },
    {
      name: 'default_meta_description',
      label: 'Default Meta Description',
      type: 'textarea',
      value: settings.default_meta_description || '',
      description: 'Fallback description used when a page-specific description is missing.'
    },
    {
      name: 'default_meta_keywords',
      label: 'Default Meta Keywords',
      type: 'text',
      value: settings.default_meta_keywords || '',
      placeholder: 'web development, custom software, SEO, automation',
      description: 'Optional global keywords fallback.'
    },
    {
      name: 'default_meta_robots',
      label: 'Default Meta Robots',
      type: 'text',
      value: settings.default_meta_robots || '',
      placeholder: 'index, follow, max-image-preview:large',
      description: 'Sitewide robots directives used when a page record leaves robots blank.'
    },
    {
      name: 'default_og_image',
      label: 'Default Social Image URL',
      type: 'text',
      value: settings.default_og_image || '',
      placeholder: '/uploads/images/social-card.jpg or https://example.com/social-card.jpg',
      description: 'Used for Open Graph and Twitter when a page-specific image is not set.'
    },
    {
      name: 'default_og_image_alt',
      label: 'Default Social Image Alt',
      type: 'text',
      value: settings.default_og_image_alt || '',
      description: 'Accessibility and social preview alt text for the default image.'
    },
    {
      name: 'default_twitter_card',
      label: 'Default Twitter Card',
      type: 'select',
      value: settings.default_twitter_card || '',
      options: twitterCardOptions,
      description: 'Used when a page does not set its own Twitter card type.'
    },
    {
      name: 'twitter_site',
      label: 'Twitter Site Handle',
      type: 'text',
      value: settings.twitter_site || '',
      placeholder: '@codexwebz',
      description: 'Optional sitewide Twitter/X handle for card attribution.'
    },
    {
      name: 'twitter_creator',
      label: 'Twitter Creator Handle',
      type: 'text',
      value: settings.twitter_creator || '',
      placeholder: '@founderhandle',
      description: 'Optional default creator handle for Twitter cards.'
    },
    {
      name: 'search_console_tag',
      label: 'Google Verification Tag',
      type: 'text',
      value: settings.search_console_tag || '',
      description: 'Value used for the google-site-verification meta tag.'
    },
    {
      name: 'bing_webmaster_tag',
      label: 'Bing Verification Tag',
      type: 'text',
      value: settings.bing_webmaster_tag || '',
      description: 'Value used for the Bing Webmaster verification meta tag.'
    },
    {
      name: 'yandex_verification_tag',
      label: 'Yandex Verification Tag',
      type: 'text',
      value: settings.yandex_verification_tag || '',
      description: 'Optional Yandex verification token.'
    },
    {
      name: 'pinterest_verification_tag',
      label: 'Pinterest Verification Tag',
      type: 'text',
      value: settings.pinterest_verification_tag || '',
      description: 'Optional Pinterest domain verification token.'
    },
    {
      name: 'facebook_domain_verification',
      label: 'Facebook Domain Verification',
      type: 'text',
      value: settings.facebook_domain_verification || '',
      description: 'Optional Facebook domain verification token.'
    },
    {
      name: 'global_schema_markup',
      label: 'Global Schema Markup JSON',
      type: 'textarea',
      rows: 10,
      fullWidth: true,
      value: settings.global_schema_markup ? JSON.stringify(settings.global_schema_markup, null, 2) : '',
      description: 'Organization or website-level JSON-LD rendered on every public page.'
    },
    {
      name: 'robots_txt',
      label: 'robots.txt Content',
      type: 'textarea',
      rows: 10,
      fullWidth: true,
      value: settings.robots_txt || '',
      description: 'Custom robots.txt body. You can use {APP_URL} as a placeholder. Sitemap is appended automatically if missing.'
    }
  ];
}

function buildPageSeoFields(editingItem = null) {
  return [
    {
      name: 'page_key',
      label: 'Page Key',
      type: 'text',
      required: true,
      value: editingItem?.page_key || '',
      description: 'Use a stable key like home, services, blog, contact, or login.'
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      value: editingItem?.slug || '',
      description: 'Optional reference slug for this SEO record.'
    },
    {
      name: 'focus_keyword',
      label: 'Focus Keyword',
      type: 'text',
      value: editingItem?.focus_keyword || '',
      placeholder: 'custom software development',
      description: 'Internal planning field for the main keyword this page should target.'
    },
    {
      name: 'meta_title',
      label: 'Meta Title',
      type: 'text',
      value: editingItem?.meta_title || ''
    },
    {
      name: 'meta_description',
      label: 'Meta Description',
      type: 'textarea',
      value: editingItem?.meta_description || ''
    },
    {
      name: 'meta_keywords',
      label: 'Meta Keywords',
      type: 'text',
      value: editingItem?.meta_keywords || ''
    },
    {
      name: 'meta_robots',
      label: 'Meta Robots',
      type: 'text',
      value: editingItem?.meta_robots || '',
      placeholder: 'index, follow, max-image-preview:large',
      description: 'Per-page robots directives. Leave blank to use the sitewide default.'
    },
    {
      name: 'canonical_url',
      label: 'Canonical URL',
      type: 'text',
      value: editingItem?.canonical_url || '',
      placeholder: '/services or https://example.com/services',
      description: 'Accepts a site-relative path or a full canonical URL.'
    },
    {
      name: 'og_type',
      label: 'OpenGraph Type',
      type: 'select',
      value: editingItem?.og_type || '',
      options: ogTypeOptions
    },
    {
      name: 'og_title',
      label: 'OpenGraph Title',
      type: 'text',
      value: editingItem?.og_title || ''
    },
    {
      name: 'og_description',
      label: 'OpenGraph Description',
      type: 'textarea',
      value: editingItem?.og_description || ''
    },
    {
      name: 'og_image',
      label: 'OpenGraph Image URL',
      type: 'text',
      fullWidth: true,
      value: editingItem?.og_image || '',
      placeholder: '/uploads/images/og-cover.jpg or https://example.com/og-cover.jpg',
      description: 'Overrides the default social image for this page.'
    },
    {
      name: 'og_image_alt',
      label: 'OpenGraph Image Alt',
      type: 'text',
      fullWidth: true,
      value: editingItem?.og_image_alt || ''
    },
    {
      name: 'twitter_card',
      label: 'Twitter Card',
      type: 'select',
      value: editingItem?.twitter_card || '',
      options: twitterCardOptions
    },
    {
      name: 'twitter_title',
      label: 'Twitter Title',
      type: 'text',
      value: editingItem?.twitter_title || ''
    },
    {
      name: 'twitter_description',
      label: 'Twitter Description',
      type: 'textarea',
      value: editingItem?.twitter_description || ''
    },
    {
      name: 'twitter_image',
      label: 'Twitter Image URL',
      type: 'text',
      fullWidth: true,
      value: editingItem?.twitter_image || '',
      placeholder: '/uploads/images/twitter-card.jpg or https://example.com/twitter-card.jpg'
    },
    {
      name: 'schema_markup',
      label: 'Schema Markup JSON',
      type: 'textarea',
      rows: 10,
      fullWidth: true,
      value: editingItem?.schema_markup ? JSON.stringify(editingItem.schema_markup, null, 2) : '',
      description: 'Optional page-level JSON-LD. Leave blank to avoid page-specific schema markup.'
    }
  ];
}

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

async function renderSeoPage(req, res) {
  const [seoSettings, settings] = await Promise.all([
    seoModel.listAll(),
    settingsModel.getSettings()
  ]);
  const editingItem = seoSettings.find((item) => item.page_key === req.query.edit) || null;
  const basePath = getDashboardBasePath(req);

  return renderModule(req, res, {
    pageTitle: 'SEO Settings',
    activeMenu: 'SEO',
    stats: [
      { label: 'SEO Records', value: seoSettings.length },
      { label: 'Custom Canonicals', value: countConfigured(seoSettings, (item) => Boolean(item.canonical_url)) },
      { label: 'Social Overrides', value: countConfigured(seoSettings, (item) => Boolean(item.og_image || item.twitter_image || item.og_title || item.twitter_title)) },
      { label: 'Schema Blocks', value: countConfigured(seoSettings, (item) => Boolean(item.schema_markup)) + (settings?.global_schema_markup ? 1 : 0) }
    ],
    form: {
      title: 'Sitewide SEO Defaults',
      description: 'These settings provide global defaults, verification tags, and robots rules for the entire public website.',
      action: `${basePath}/seo/sitewide`,
      submitLabel: 'Save Sitewide SEO',
      fields: buildSitewideSeoFields(settings)
    },
    secondaryForm: {
      title: editingItem ? `Edit ${editingItem.page_key}` : 'Create or Update Page SEO Record',
      description: 'Page-level records override the sitewide defaults when you need page-specific robots rules, social cards, or schema markup.',
      action: `${basePath}/seo`,
      submitLabel: 'Save Page SEO',
      fields: buildPageSeoFields(editingItem)
    },
    infoPanel: {
      title: 'SEO Publishing Logic',
      body: 'Sitewide defaults handle verification tags, fallback metadata, social images, and robots.txt. Individual page records then override those defaults only where needed, which keeps the setup powerful without making every page manually configured.'
    },
    table: {
      title: 'SEO Records',
      description: 'Page-specific overrides for titles, robots rules, social cards, canonical URLs, and JSON-LD.',
      columns: [
        { label: 'Page Key', key: 'page_key' },
        { label: 'Focus Keyword', key: 'focus_keyword' },
        { label: 'Meta Robots', key: 'meta_robots' },
        { label: 'Updated', key: 'updated_at', type: 'date' }
      ],
      rows: seoSettings,
      rowActions: (item) => `
        <a class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" href="${basePath}/seo?edit=${item.page_key}">Edit</a>
      `
    }
  });
}

async function upsertSeo(req, res) {
  const pageKey = sanitizePlainText(req.body.page_key);
  const seo = await seoModel.upsert(pageKey, {
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords),
    focus_keyword: sanitizePlainText(req.body.focus_keyword),
    meta_robots: sanitizePlainText(req.body.meta_robots),
    slug: sanitizePlainText(req.body.slug),
    schema_markup: parseJsonInput(req.body.schema_markup),
    og_type: sanitizePlainText(req.body.og_type),
    og_title: sanitizePlainText(req.body.og_title),
    og_description: sanitizePlainText(req.body.og_description),
    og_image: sanitizePlainText(req.body.og_image),
    og_image_alt: sanitizePlainText(req.body.og_image_alt),
    twitter_card: sanitizePlainText(req.body.twitter_card),
    twitter_title: sanitizePlainText(req.body.twitter_title),
    twitter_description: sanitizePlainText(req.body.twitter_description),
    twitter_image: sanitizePlainText(req.body.twitter_image),
    canonical_url: sanitizePlainText(req.body.canonical_url)
  });

  return respond(req, res, { message: 'SEO settings saved successfully.', seo }, `${getDashboardBasePath(req)}/seo?success=SEO%20settings%20saved%20successfully.`);
}

async function updateSitewideSeo(req, res) {
  const settings = await settingsModel.updateSettings({
    default_meta_title: sanitizePlainText(req.body.default_meta_title),
    default_meta_description: sanitizePlainText(req.body.default_meta_description),
    default_meta_keywords: sanitizePlainText(req.body.default_meta_keywords),
    default_meta_robots: sanitizePlainText(req.body.default_meta_robots),
    default_og_image: sanitizePlainText(req.body.default_og_image),
    default_og_image_alt: sanitizePlainText(req.body.default_og_image_alt),
    default_twitter_card: sanitizePlainText(req.body.default_twitter_card),
    twitter_site: sanitizePlainText(req.body.twitter_site),
    twitter_creator: sanitizePlainText(req.body.twitter_creator),
    search_console_tag: sanitizePlainText(req.body.search_console_tag),
    bing_webmaster_tag: sanitizePlainText(req.body.bing_webmaster_tag),
    yandex_verification_tag: sanitizePlainText(req.body.yandex_verification_tag),
    pinterest_verification_tag: sanitizePlainText(req.body.pinterest_verification_tag),
    facebook_domain_verification: sanitizePlainText(req.body.facebook_domain_verification),
    global_schema_markup: parseJsonInput(req.body.global_schema_markup),
    robots_txt: sanitizePlainText(req.body.robots_txt)
  });

  return respond(
    req,
    res,
    { message: 'Sitewide SEO settings saved successfully.', settings },
    `${getDashboardBasePath(req)}/seo?success=Sitewide%20SEO%20settings%20saved%20successfully.`
  );
}

async function apiList(req, res) {
  const [seoSettings, settings] = await Promise.all([
    seoModel.listAll(),
    settingsModel.getSettings()
  ]);

  return res.json({
    seoSettings,
    sitewideSeo: {
      default_meta_title: settings?.default_meta_title || null,
      default_meta_description: settings?.default_meta_description || null,
      default_meta_keywords: settings?.default_meta_keywords || null,
      default_meta_robots: settings?.default_meta_robots || null,
      default_og_image: settings?.default_og_image || null,
      default_og_image_alt: settings?.default_og_image_alt || null,
      default_twitter_card: settings?.default_twitter_card || null,
      twitter_site: settings?.twitter_site || null,
      twitter_creator: settings?.twitter_creator || null,
      search_console_tag: settings?.search_console_tag || null,
      bing_webmaster_tag: settings?.bing_webmaster_tag || null,
      yandex_verification_tag: settings?.yandex_verification_tag || null,
      pinterest_verification_tag: settings?.pinterest_verification_tag || null,
      facebook_domain_verification: settings?.facebook_domain_verification || null,
      global_schema_markup: settings?.global_schema_markup || null,
      robots_txt: settings?.robots_txt || null
    }
  });
}

module.exports = {
  renderSeoPage,
  upsertSeo,
  updateSitewideSeo,
  apiList
};
