const mediaAssetModel = require('../models/mediaAssetModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText } = require('../utils/content');
const { syncKnownMediaAssets } = require('../services/mediaAssetService');

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

async function renderMediaPage(req, res) {
  await syncKnownMediaAssets();

  const assets = await mediaAssetModel.listAll();
  const editingAsset = assets.find((item) => item.id === Number(req.query.edit)) || null;
  const basePath = getDashboardBasePath(req);

  return renderModule(req, res, {
    pageTitle: 'Media SEO',
    activeMenu: 'Media',
    stats: [
      { label: 'Tracked Images', value: assets.length },
      { label: 'Custom Alt Text', value: assets.filter((asset) => asset.alt_text).length }
    ],
    form: {
      title: editingAsset ? `Edit ${editingAsset.file_path.split('/').pop()}` : 'Select an image to edit',
      description: editingAsset
        ? `Update the reusable alt text for ${editingAsset.file_path}. This change is used anywhere the image is rendered through the managed frontend.`
        : 'Choose an image from the table to add or refine its reusable alt text.',
      action: editingAsset ? `${basePath}/media/${editingAsset.id}/update` : '#',
      submitLabel: 'Save Alt Text',
      fields: editingAsset
        ? [
            {
              name: 'title',
              label: 'Media Title',
              type: 'text',
              value: editingAsset.title || ''
            },
            {
              name: 'alt_text',
              label: 'Alt Text',
              type: 'textarea',
              rows: 4,
              required: true,
              value: editingAsset.alt_text || '',
              description: 'Describe the image for screen readers and search/social accessibility, similar to editing attachment alt text in a CMS.'
            }
          ]
        : [
            {
              name: 'title',
              label: 'Media Title',
              type: 'text',
              value: '',
              description: 'Select an existing image from the table to begin editing.'
            }
          ]
    },
    infoPanel: {
      title: 'WordPress-style image accessibility control',
      body: 'This screen keeps uploaded images discoverable from one place so alt text can be refined later without re-uploading files. Existing records are synchronized from settings, services, products, projects, blog posts, team profiles, and embedded rich-text images.'
    },
    table: {
      title: 'Tracked Images',
      description: 'Edit reusable alt text for any uploaded image already referenced by the site or dashboard content.',
      columns: [
        { label: 'File', key: 'file_path' },
        { label: 'Title', key: 'title' },
        { label: 'Alt Text', key: 'alt_text' },
        { label: 'Source', key: 'source_module' },
        { label: 'Updated', key: 'updated_at', type: 'date' }
      ],
      rows: assets,
      rowActions: (asset) => `
        <div class="flex flex-wrap gap-2">
          <a class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" href="${basePath}/media?edit=${asset.id}">Edit</a>
        </div>
      `
    }
  });
}

async function updateMediaAsset(req, res) {
  const asset = await mediaAssetModel.updateAsset(Number(req.params.id), {
    title: sanitizePlainText(req.body.title),
    alt_text: sanitizePlainText(req.body.alt_text)
  });

  return respond(
    req,
    res,
    { message: 'Media alt text saved successfully.', asset },
    `${getDashboardBasePath(req)}/media?edit=${asset.id}&success=Media%20alt%20text%20saved%20successfully.`
  );
}

module.exports = {
  renderMediaPage,
  updateMediaAsset
};
