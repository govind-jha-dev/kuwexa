const pageModel = require('../models/pageModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText, sanitizeRichText, makeSlug, toJson } = require('../utils/content');

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

async function renderPagesPage(req, res) {
  const pages = await pageModel.listAll();
  const editingPage = pages.find((item) => item.id === Number(req.query.edit)) || null;
  const basePath = getDashboardBasePath(req);

  return renderModule(req, res, {
    pageTitle: 'Pages CMS',
    activeMenu: 'Pages',
    stats: [
      { label: 'Total Pages', value: pages.length },
      { label: 'Published', value: pages.filter((page) => page.status === 'published').length }
    ],
    form: {
      title: editingPage ? `Edit ${editingPage.title}` : 'Create Page',
      action: editingPage ? `${basePath}/pages/${editingPage.id}/update` : `${basePath}/pages`,
      submitLabel: editingPage ? 'Update Page' : 'Create Page',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, value: editingPage?.title || '' },
        { name: 'slug', label: 'Slug', type: 'text', value: editingPage?.slug || '' },
        {
          name: 'page_type',
          label: 'Page Type',
          type: 'select',
          value: editingPage?.page_type || 'page',
          options: [
            { label: 'page', value: 'page' },
            { label: 'policy', value: 'policy' },
            { label: 'landing', value: 'landing' }
          ]
        },
        { name: 'template', label: 'Template', type: 'text', value: editingPage?.template || 'default' },
        { name: 'body', label: 'Body', type: 'richtext', value: editingPage?.body || '' },
        { name: 'meta_title', label: 'Meta Title', type: 'text', value: editingPage?.meta_title || '' },
        { name: 'meta_description', label: 'Meta Description', type: 'textarea', value: editingPage?.meta_description || '' },
        { name: 'canonical_url', label: 'Canonical URL', type: 'text', value: editingPage?.canonical_url || '' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          value: editingPage?.status || 'draft',
          options: [
            { label: 'draft', value: 'draft' },
            { label: 'published', value: 'published' }
          ]
        }
      ]
    },
    table: {
      title: 'Pages',
      description: 'Manage standalone pages, policies, and SEO-ready content.',
      columns: [
        { label: 'Title', key: 'title' },
        { label: 'Slug', key: 'slug' },
        { label: 'Type', key: 'page_type' },
        { label: 'Status', key: 'status' },
        { label: 'Updated', key: 'updated_at', type: 'date' }
      ],
      rows: pages,
      rowActions: (page) => `
        <div class="flex flex-wrap gap-2">
          <a class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" href="${basePath}/pages?edit=${page.id}">Edit</a>
          <form method="post" action="${basePath}/pages/${page.id}/delete" class="inline-flex">
            <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
            <button class="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white" type="submit">Delete</button>
          </form>
        </div>
      `
    }
  });
}

async function createPage(req, res) {
  const title = sanitizePlainText(req.body.title);
  const slug = sanitizePlainText(req.body.slug) || makeSlug(title);

  const page = await pageModel.createPage({
    title,
    slug,
    page_type: sanitizePlainText(req.body.page_type) || 'page',
    body: sanitizeRichText(req.body.body),
    template: sanitizePlainText(req.body.template),
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    schema_markup: toJson(null),
    og_title: sanitizePlainText(req.body.og_title),
    og_description: sanitizePlainText(req.body.og_description),
    canonical_url: sanitizePlainText(req.body.canonical_url),
    status: sanitizePlainText(req.body.status) || 'draft',
    created_by: req.user.id,
    updated_by: req.user.id
  });

  return respond(req, res, { message: 'Page created successfully.', page }, `${getDashboardBasePath(req)}/pages?success=Page%20created%20successfully.`);
}

async function updatePage(req, res) {
  const title = sanitizePlainText(req.body.title);
  const page = await pageModel.updatePage(Number(req.params.id), {
    title,
    slug: sanitizePlainText(req.body.slug) || makeSlug(title),
    page_type: sanitizePlainText(req.body.page_type) || 'page',
    body: sanitizeRichText(req.body.body),
    template: sanitizePlainText(req.body.template),
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    canonical_url: sanitizePlainText(req.body.canonical_url),
    status: sanitizePlainText(req.body.status) || 'draft',
    updated_by: req.user.id
  });

  return respond(req, res, { message: 'Page updated successfully.', page }, `${getDashboardBasePath(req)}/pages?success=Page%20updated%20successfully.`);
}

async function deletePage(req, res) {
  await pageModel.deletePage(Number(req.params.id));
  return respond(req, res, { message: 'Page deleted successfully.' }, `${getDashboardBasePath(req)}/pages?success=Page%20deleted%20successfully.`);
}

async function apiList(req, res) {
  const pages = await pageModel.listAll();
  return res.json({ pages });
}

module.exports = {
  renderPagesPage,
  createPage,
  updatePage,
  deletePage,
  apiList
};
