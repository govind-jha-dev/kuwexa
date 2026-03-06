const seoModel = require('../models/seoModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText, parseJsonInput } = require('../utils/content');

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

async function renderSeoPage(req, res) {
  const seoSettings = await seoModel.listAll();
  const editingItem = seoSettings.find((item) => item.page_key === req.query.edit) || null;
  const basePath = getDashboardBasePath(req);

  return renderModule(req, res, {
    pageTitle: 'SEO Settings',
    activeMenu: 'SEO',
    stats: [
      { label: 'SEO Records', value: seoSettings.length }
    ],
    form: {
      title: editingItem ? `Edit ${editingItem.page_key}` : 'Update SEO Record',
      action: `${basePath}/seo`,
      submitLabel: 'Save SEO Settings',
      fields: [
        { name: 'page_key', label: 'Page Key', type: 'text', required: true, value: editingItem?.page_key || '' },
        { name: 'slug', label: 'Slug', type: 'text', value: editingItem?.slug || '' },
        { name: 'meta_title', label: 'Meta Title', type: 'text', value: editingItem?.meta_title || '' },
        { name: 'meta_description', label: 'Meta Description', type: 'textarea', value: editingItem?.meta_description || '' },
        { name: 'og_title', label: 'OpenGraph Title', type: 'text', value: editingItem?.og_title || '' },
        { name: 'og_description', label: 'OpenGraph Description', type: 'textarea', value: editingItem?.og_description || '' },
        { name: 'canonical_url', label: 'Canonical URL', type: 'text', value: editingItem?.canonical_url || '' },
        { name: 'schema_markup', label: 'Schema Markup JSON', type: 'textarea', value: editingItem?.schema_markup ? JSON.stringify(editingItem.schema_markup, null, 2) : '' }
      ]
    },
    table: {
      title: 'SEO Records',
      description: 'Full control over metadata, schema, and canonical URLs.',
      columns: [
        { label: 'Page Key', key: 'page_key' },
        { label: 'Slug', key: 'slug' },
        { label: 'Meta Title', key: 'meta_title' },
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
    slug: sanitizePlainText(req.body.slug),
    schema_markup: parseJsonInput(req.body.schema_markup),
    og_title: sanitizePlainText(req.body.og_title),
    og_description: sanitizePlainText(req.body.og_description),
    canonical_url: sanitizePlainText(req.body.canonical_url)
  });

  return respond(req, res, { message: 'SEO settings saved successfully.', seo }, `${getDashboardBasePath(req)}/seo?success=SEO%20settings%20saved%20successfully.`);
}

async function apiList(req, res) {
  const seoSettings = await seoModel.listAll();
  return res.json({ seoSettings });
}

module.exports = {
  renderSeoPage,
  upsertSeo,
  apiList
};
