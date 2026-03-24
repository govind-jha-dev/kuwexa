const productModel = require('../models/productModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText, sanitizeRichText, makeSlug, toJson } = require('../utils/content');
const { splitCsv } = require('../utils/serializers');
const { registerAsset, registerMany, normalizeImageItems } = require('../services/mediaAssetService');

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

function filePath(file) {
  return file ? `/uploads/images/${file.filename}` : null;
}

function imagePaths(files = []) {
  return files.map((file) => `/uploads/images/${file.filename}`);
}

async function renderProductsPage(req, res) {
  const products = await productModel.listAll();
  const editingProduct = products.find((item) => item.id === Number(req.query.edit)) || null;
  const basePath = getDashboardBasePath(req);

  return renderModule(req, res, {
    pageTitle: 'Products Management',
    activeMenu: 'Products',
    stats: [
      { label: 'Products', value: products.length },
      { label: 'Published', value: products.filter((product) => product.status === 'published').length }
    ],
    form: {
      title: editingProduct ? `Edit ${editingProduct.name}` : 'Create Product',
      action: editingProduct ? `${basePath}/products/${editingProduct.id}/update` : `${basePath}/products`,
      submitLabel: editingProduct ? 'Update Product' : 'Create Product',
      enctype: 'multipart/form-data',
      fields: [
        { name: 'name', label: 'Product Name', type: 'text', required: true, value: editingProduct?.name || '' },
        { name: 'slug', label: 'Slug', type: 'text', value: editingProduct?.slug || '' },
        { name: 'short_description', label: 'Short Description', type: 'textarea', rows: 3, value: editingProduct?.short_description || '' },
        { name: 'description', label: 'Product Overview', type: 'richtext', value: editingProduct?.description || '' },
        {
          name: 'features',
          label: 'Features List',
          type: 'textarea',
          rows: 4,
          value: editingProduct?.features?.join(', ') || '',
          description: 'Separate features with commas or new lines.'
        },
        {
          name: 'tech_stack',
          label: 'Technology Stack',
          type: 'textarea',
          rows: 3,
          value: editingProduct?.tech_stack?.join(', ') || '',
          description: 'Separate technologies with commas or new lines.'
        },
        { name: 'demo_link', label: 'Demo Link', type: 'url', value: editingProduct?.demo_link || '' },
        { name: 'website_link', label: 'Website Link', type: 'url', value: editingProduct?.website_link || '' },
        {
          name: 'logo',
          label: 'Product Logo',
          type: 'file',
          accept: 'image/*',
          previewUrl: editingProduct?.logo || '',
          description: 'Upload the primary product mark used on the listing page and detail hero.'
        },
        {
          name: 'images',
          label: 'Product Screenshots',
          type: 'file',
          accept: 'image/*',
          multiple: true,
          description: editingProduct?.images?.length
            ? `${editingProduct.images.length} screenshots are currently saved. Upload new files to replace the gallery.`
            : 'Upload one or more screenshots for the detail page gallery.'
        },
        { name: 'meta_title', label: 'Meta Title', type: 'text', value: editingProduct?.meta_title || '' },
        { name: 'meta_description', label: 'Meta Description', type: 'textarea', value: editingProduct?.meta_description || '' },
        { name: 'meta_keywords', label: 'Meta Keywords', type: 'text', value: editingProduct?.meta_keywords || '', placeholder: 'saas software, business automation, codexwebz product' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          value: editingProduct?.status || 'draft',
          options: [
            { label: 'draft', value: 'draft' },
            { label: 'published', value: 'published' }
          ]
        }
      ]
    },
    infoPanel: {
      title: 'Products are now a first-class public module.',
      body: 'Each record controls the listing card, detailed product page, screenshots gallery, links, and SEO fields. Publish to make the product visible on the website.'
    },
    table: {
      title: 'Products',
      description: 'Manage SaaS and business software products showcased on the public website.',
      columns: [
        { label: 'Name', key: 'name' },
        { label: 'Slug', key: 'slug' },
        { label: 'Demo', key: 'demo_link' },
        { label: 'Status', key: 'status' },
        { label: 'Updated', key: 'updated_at', type: 'date' }
      ],
      rows: products,
      rowActions: (product) => `
        <div class="flex flex-wrap gap-2">
          <a class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" href="${basePath}/products?edit=${product.id}">Edit</a>
          <form method="post" action="${basePath}/products/${product.id}/delete" class="inline-flex">
            <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
            <button class="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white" type="submit">Delete</button>
          </form>
        </div>
      `
    }
  });
}

async function createProduct(req, res) {
  const name = sanitizePlainText(req.body.name);
  const logo = filePath(req.files?.logo?.[0]);
  const images = imagePaths(req.files?.images || []);

  const product = await productModel.createProduct({
    name,
    slug: sanitizePlainText(req.body.slug) || makeSlug(name, 'product'),
    short_description: sanitizePlainText(req.body.short_description),
    description: sanitizeRichText(req.body.description),
    features: toJson(splitCsv(req.body.features)),
    tech_stack: toJson(splitCsv(req.body.tech_stack)),
    logo,
    images: toJson(images),
    demo_link: sanitizePlainText(req.body.demo_link),
    website_link: sanitizePlainText(req.body.website_link),
    status: sanitizePlainText(req.body.status) || 'draft',
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords),
    created_by: req.user.id,
    updated_by: req.user.id
  });

  await Promise.all([
    registerAsset(product?.logo, {
      title: product?.name,
      altText: `${product?.name || 'Kuwexa'} logo`,
      sourceModule: 'Products'
    }),
    registerMany(
      normalizeImageItems(product?.images).map((image, index) => ({
        file_path: image.path,
        title: product?.name,
        alt_text: image.alt || `${product?.name || 'Kuwexa'} screenshot ${index + 1}`,
        source_module: 'Products'
      }))
    )
  ]);

  return respond(req, res, { message: 'Product created successfully.', product }, `${getDashboardBasePath(req)}/products?success=Product%20created%20successfully.`);
}

async function updateProduct(req, res) {
  const name = sanitizePlainText(req.body.name);
  const updates = {
    name,
    slug: sanitizePlainText(req.body.slug) || makeSlug(name, 'product'),
    short_description: sanitizePlainText(req.body.short_description),
    description: sanitizeRichText(req.body.description),
    features: toJson(splitCsv(req.body.features)),
    tech_stack: toJson(splitCsv(req.body.tech_stack)),
    demo_link: sanitizePlainText(req.body.demo_link),
    website_link: sanitizePlainText(req.body.website_link),
    status: sanitizePlainText(req.body.status) || 'draft',
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords),
    updated_by: req.user.id
  };

  const logo = filePath(req.files?.logo?.[0]);
  if (logo) {
    updates.logo = logo;
  }

  const images = imagePaths(req.files?.images || []);
  if (images.length) {
    updates.images = toJson(images);
  }

  const product = await productModel.updateProduct(Number(req.params.id), updates);
  await Promise.all([
    registerAsset(product?.logo, {
      title: product?.name,
      altText: `${product?.name || 'Kuwexa'} logo`,
      sourceModule: 'Products'
    }),
    registerMany(
      normalizeImageItems(product?.images).map((image, index) => ({
        file_path: image.path,
        title: product?.name,
        alt_text: image.alt || `${product?.name || 'Kuwexa'} screenshot ${index + 1}`,
        source_module: 'Products'
      }))
    )
  ]);
  return respond(req, res, { message: 'Product updated successfully.', product }, `${getDashboardBasePath(req)}/products?success=Product%20updated%20successfully.`);
}

async function deleteProduct(req, res) {
  await productModel.deleteProduct(Number(req.params.id));
  return respond(req, res, { message: 'Product deleted successfully.' }, `${getDashboardBasePath(req)}/products?success=Product%20deleted%20successfully.`);
}

async function apiList(req, res) {
  const products = await productModel.listAll();
  return res.json({ products });
}

module.exports = {
  renderProductsPage,
  createProduct,
  updateProduct,
  deleteProduct,
  apiList
};
