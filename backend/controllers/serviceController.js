const serviceModel = require('../models/serviceModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText, sanitizeRichText, makeSlug, toJson } = require('../utils/content');
const { resolveServiceProfile } = require('../services/siteContentService');
const { registerAsset } = require('../services/mediaAssetService');

function normalizeLineItems(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const items = String(value)
    .split(/\r?\n/)
    .map((item) => sanitizePlainText(item))
    .filter(Boolean);

  return items.length ? items : null;
}

function formatLineItems(value) {
  return Array.isArray(value) ? value.join('\n') : '';
}

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
  const services = (await serviceModel.listAll()).map((service) => {
    const profile = resolveServiceProfile(service);

    return {
      ...service,
      category: service.category || profile.category,
      kicker: service.kicker || profile.kicker,
      deliverables: service.deliverables || profile.deliverables,
      outcomes: service.outcomes || profile.outcomes,
      process: service.process || profile.process,
      profile
    };
  });
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
        {
          name: 'category',
          label: 'Category',
          type: 'text',
          value: editingService?.category || editingService?.profile?.category || '',
          description: 'Example: Web Development Services, Ecommerce Solutions, Software Development.'
        },
        { name: 'short_description', label: 'Short Description', type: 'textarea', value: editingService?.short_description || '' },
        {
          name: 'kicker',
          label: 'Service Focus',
          type: 'textarea',
          rows: 3,
          value: editingService?.kicker || editingService?.profile?.kicker || '',
          description: 'This appears in the service detail sidebar as the short strategic positioning line.'
        },
        {
          name: 'deliverables',
          label: 'Deliverables',
          type: 'textarea',
          rows: 6,
          value: formatLineItems(editingService?.deliverables || editingService?.profile?.deliverables),
          description: 'Add one deliverable per line. These are shown as the key service outputs.'
        },
        {
          name: 'outcomes',
          label: 'Expected Outcomes',
          type: 'textarea',
          rows: 6,
          value: formatLineItems(editingService?.outcomes || editingService?.profile?.outcomes),
          description: 'Add one expected outcome per line. These appear on the public service detail page.'
        },
        {
          name: 'process',
          label: 'Delivery Sequence',
          type: 'textarea',
          rows: 6,
          value: formatLineItems(editingService?.process || editingService?.profile?.process),
          description: 'Add one delivery step per line. These power the process section on the service detail page.'
        },
        { name: 'description', label: 'Description', type: 'richtext', value: editingService?.description || '' },
        { name: 'icon', label: 'Icon Class', type: 'text', value: editingService?.icon || '' },
        {
          name: 'image',
          label: 'Service Image',
          type: 'file',
          accept: 'image/*',
          previewUrl: editingService?.image || null
        },
        { name: 'meta_title', label: 'Meta Title', type: 'text', value: editingService?.meta_title || '' },
        { name: 'meta_description', label: 'Meta Description', type: 'textarea', value: editingService?.meta_description || '' },
        { name: 'meta_keywords', label: 'Meta Keywords', type: 'text', value: editingService?.meta_keywords || '' }
      ]
    },
    table: {
      title: 'Services',
      description: 'Managers can update service pages, content, and media assets.',
      columns: [
        { label: 'Title', key: 'title' },
        { label: 'Category', key: 'category' },
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
    category: sanitizePlainText(req.body.category),
    short_description: sanitizePlainText(req.body.short_description),
    kicker: sanitizePlainText(req.body.kicker),
    deliverables: toJson(normalizeLineItems(req.body.deliverables)),
    outcomes: toJson(normalizeLineItems(req.body.outcomes)),
    process: toJson(normalizeLineItems(req.body.process)),
    description: sanitizeRichText(req.body.description),
    icon: sanitizePlainText(req.body.icon),
    image: imagePath(req.file),
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords),
    schema_markup: null,
    created_by: req.user.id,
    updated_by: req.user.id
  });

  await registerAsset(service?.image, {
    title: service?.title,
    altText: `${service?.title || 'Kuwexa'} service image`,
    sourceModule: 'Services'
  });

  return respond(req, res, { message: 'Service created successfully.', service }, `${getDashboardBasePath(req)}/services?success=Service%20created%20successfully.`);
}

async function updateService(req, res) {
  const title = sanitizePlainText(req.body.title);
  const updates = {
    title,
    slug: sanitizePlainText(req.body.slug) || makeSlug(title),
    category: sanitizePlainText(req.body.category),
    short_description: sanitizePlainText(req.body.short_description),
    kicker: sanitizePlainText(req.body.kicker),
    deliverables: toJson(normalizeLineItems(req.body.deliverables)),
    outcomes: toJson(normalizeLineItems(req.body.outcomes)),
    process: toJson(normalizeLineItems(req.body.process)),
    description: sanitizeRichText(req.body.description),
    icon: sanitizePlainText(req.body.icon),
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords),
    updated_by: req.user.id
  };

  if (req.file) {
    updates.image = imagePath(req.file);
  }

  const service = await serviceModel.updateService(Number(req.params.id), updates);
  await registerAsset(service?.image, {
    title: service?.title,
    altText: `${service?.title || 'Kuwexa'} service image`,
    sourceModule: 'Services'
  });
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
