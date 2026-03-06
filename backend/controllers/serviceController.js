const serviceModel = require('../models/serviceModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText, sanitizeRichText, makeSlug } = require('../utils/content');

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

function imagePath(file) {
  return file ? `/uploads/images/${file.filename}` : null;
}

async function renderServicesPage(req, res) {
  const services = await serviceModel.listAll();
  const editingService = services.find((item) => item.id === Number(req.query.edit)) || null;
  const basePath = getDashboardBasePath(req);

  return renderModule(req, res, {
    pageTitle: 'Services Management',
    activeMenu: 'Services',
    stats: [
      { label: 'Services', value: services.length }
    ],
    form: {
      title: editingService ? `Edit ${editingService.title}` : 'Create Service',
      action: editingService ? `${basePath}/services/${editingService.id}/update` : `${basePath}/services`,
      submitLabel: editingService ? 'Update Service' : 'Create Service',
      enctype: 'multipart/form-data',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, value: editingService?.title || '' },
        { name: 'slug', label: 'Slug', type: 'text', value: editingService?.slug || '' },
        { name: 'short_description', label: 'Short Description', type: 'textarea', value: editingService?.short_description || '' },
        { name: 'description', label: 'Description', type: 'richtext', value: editingService?.description || '' },
        { name: 'icon', label: 'Icon Class', type: 'text', value: editingService?.icon || '' },
        { name: 'image', label: 'Service Image', type: 'file', accept: 'image/*' },
        { name: 'meta_title', label: 'Meta Title', type: 'text', value: editingService?.meta_title || '' },
        { name: 'meta_description', label: 'Meta Description', type: 'textarea', value: editingService?.meta_description || '' }
      ]
    },
    table: {
      title: 'Services',
      description: 'Managers can update service pages, content, and media assets.',
      columns: [
        { label: 'Title', key: 'title' },
        { label: 'Slug', key: 'slug' },
        { label: 'Icon', key: 'icon' },
        { label: 'Updated', key: 'updated_at', type: 'date' }
      ],
      rows: services,
      rowActions: (service) => `
        <div class="flex flex-wrap gap-2">
          <a class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" href="${basePath}/services?edit=${service.id}">Edit</a>
          <form method="post" action="${basePath}/services/${service.id}/delete" class="inline-flex">
            <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
            <button class="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white" type="submit">Delete</button>
          </form>
        </div>
      `
    }
  });
}

async function createService(req, res) {
  const title = sanitizePlainText(req.body.title);
  const service = await serviceModel.createService({
    title,
    slug: sanitizePlainText(req.body.slug) || makeSlug(title),
    short_description: sanitizePlainText(req.body.short_description),
    description: sanitizeRichText(req.body.description),
    icon: sanitizePlainText(req.body.icon),
    image: imagePath(req.file),
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    schema_markup: null,
    created_by: req.user.id,
    updated_by: req.user.id
  });

  return respond(req, res, { message: 'Service created successfully.', service }, `${getDashboardBasePath(req)}/services?success=Service%20created%20successfully.`);
}

async function updateService(req, res) {
  const title = sanitizePlainText(req.body.title);
  const updates = {
    title,
    slug: sanitizePlainText(req.body.slug) || makeSlug(title),
    short_description: sanitizePlainText(req.body.short_description),
    description: sanitizeRichText(req.body.description),
    icon: sanitizePlainText(req.body.icon),
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    updated_by: req.user.id
  };

  if (req.file) {
    updates.image = imagePath(req.file);
  }

  const service = await serviceModel.updateService(Number(req.params.id), updates);
  return respond(req, res, { message: 'Service updated successfully.', service }, `${getDashboardBasePath(req)}/services?success=Service%20updated%20successfully.`);
}

async function deleteService(req, res) {
  await serviceModel.deleteService(Number(req.params.id));
  return respond(req, res, { message: 'Service deleted successfully.' }, `${getDashboardBasePath(req)}/services?success=Service%20deleted%20successfully.`);
}

async function apiList(req, res) {
  const services = await serviceModel.listAll();
  return res.json({ services });
}

module.exports = {
  renderServicesPage,
  createService,
  updateService,
  deleteService,
  apiList
};
