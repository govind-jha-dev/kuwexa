const productModel = require('../models/productModel');
const productCategoryModel = require('../models/productCategoryModel');
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

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function renderProductsPage(req, res) {
  const [products, categories] = await Promise.all([
    productModel.listAll(),
    productCategoryModel.listAll()
  ]);
  const editingProduct = products.find((item) => item.id === Number(req.query.edit)) || null;
  const editingCategory = categories.find((item) => item.id === Number(req.query.editCategory)) || null;
  const basePath = getDashboardBasePath(req);

  return renderModule(req, res, {
    pageTitle: 'B2B Catalog Management',
    activeMenu: 'B2B Catalog',
    stats: [
      { label: 'B2B Products', value: products.length },
      { label: 'Published', value: products.filter((product) => product.status === 'published').length },
      { label: 'Categories', value: categories.length },
      { label: 'Draft Categories', value: categories.filter((category) => category.status === 'draft').length }
    ],
    form: {
      title: editingProduct ? `Edit ${editingProduct.name}` : 'Create B2B Product',
      action: editingProduct ? `${basePath}/products/${editingProduct.id}/update` : `${basePath}/products`,
      submitLabel: editingProduct ? 'Update Product' : 'Create Product',
      enctype: 'multipart/form-data',
      fields: [
        { name: 'name', label: 'Product Name', type: 'text', required: true, value: editingProduct?.name || '' },
        {
          name: 'category_id',
          label: 'Category',
          type: 'select',
          required: true,
          value: editingProduct?.category_id || '',
          options: [
            { label: 'Select a category', value: '' },
            ...categories.map((category) => ({
              label: category.name,
              value: category.id
            }))
          ],
          description: 'Categories are managed from the secondary form below and drive the B2B page filter menu. Examples: Dry Fruits, Spices, Woollen Products, Cereals / Grains.'
        },
        { name: 'slug', label: 'Slug', type: 'text', value: editingProduct?.slug || '' },
        { name: 'short_description', label: 'Short Description', type: 'textarea', rows: 3, value: editingProduct?.short_description || '' },
        { name: 'description', label: 'Product Overview', type: 'richtext', value: editingProduct?.description || '' },
        {
          name: 'features',
          label: 'Key Highlights',
          type: 'textarea',
          rows: 4,
          value: editingProduct?.features?.join(', ') || '',
          description: 'Separate highlights with commas or new lines.'
        },
        {
          name: 'tech_stack',
          label: 'Product Tags / Applications',
          type: 'textarea',
          rows: 3,
          value: editingProduct?.tech_stack?.join(', ') || '',
          description: 'Use this for use-cases, materials, or quick tags. Separate entries with commas or new lines.'
        },
        {
          name: 'min_order_quantity',
          label: 'Minimum Order Quantity',
          type: 'text',
          value: editingProduct?.min_order_quantity || '',
          placeholder: '100'
        },
        {
          name: 'unit_label',
          label: 'Unit Label',
          type: 'text',
          value: editingProduct?.unit_label || '',
          placeholder: 'Pieces / Boxes / KG'
        },
        { name: 'catalog_link', label: 'Catalog / Brochure Link', type: 'url', value: editingProduct?.catalog_link || '' },
        { name: 'website_link', label: 'Reference Website Link', type: 'url', value: editingProduct?.website_link || '' },
        { name: 'demo_link', label: 'Secondary Action Link', type: 'url', value: editingProduct?.demo_link || '' },
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
          label: 'Product Images',
          type: 'file',
          accept: 'image/*',
          multiple: true,
          description: editingProduct?.images?.length
            ? `${editingProduct.images.length} product images are currently saved. Upload new files to replace the gallery.`
            : 'Upload multiple product images for a single product detail page gallery.'
        },
        {
          name: 'sort_order',
          label: 'Sort Order',
          type: 'number',
          min: 0,
          step: 1,
          value: editingProduct?.sort_order ?? 0,
          description: 'Lower numbers appear first on the public B2B page.'
        },
        { name: 'meta_title', label: 'Meta Title', type: 'text', value: editingProduct?.meta_title || '' },
        { name: 'meta_description', label: 'Meta Description', type: 'textarea', value: editingProduct?.meta_description || '' },
        { name: 'meta_keywords', label: 'Meta Keywords', type: 'text', value: editingProduct?.meta_keywords || '', placeholder: 'b2b product, bulk order, category name' },
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
    secondaryForm: {
      title: editingCategory ? `Edit ${editingCategory.name}` : 'Create Product Category',
      action: editingCategory ? `${basePath}/products/categories/${editingCategory.id}/update` : `${basePath}/products/categories`,
      submitLabel: editingCategory ? 'Update Category' : 'Create Category',
      fields: [
        { name: 'name', label: 'Category Name', type: 'text', required: true, value: editingCategory?.name || '' },
        { name: 'slug', label: 'Slug', type: 'text', value: editingCategory?.slug || '' },
        {
          name: 'description',
          label: 'Category Description',
          type: 'textarea',
          rows: 4,
          value: editingCategory?.description || '',
          description: 'Examples: Dry fruits and nuts for wholesale buyers, premium spice blends, woollen textile lines, or cereals and grains for bulk supply.'
        },
        {
          name: 'sort_order',
          label: 'Sort Order',
          type: 'number',
          min: 0,
          step: 1,
          value: editingCategory?.sort_order ?? 0
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          value: editingCategory?.status || 'published',
          options: [
            { label: 'published', value: 'published' },
            { label: 'draft', value: 'draft' }
          ]
        }
      ]
    },
    infoPanel: {
      title: 'The B2B catalog is now dashboard-driven.',
      body: 'Categories such as dry fruits, spices, woollen products, and cereals or grains control the public B2B menu. Each product record can include descriptions, highlights, MOQ details, and multiple uploaded images for the detail page and enquiry flow.'
    },
    table: {
      title: 'B2B Products',
      description: 'Manage the products shown on the public B2B catalog and detail pages.',
      columns: [
        { label: 'Name', key: 'name' },
        { label: 'Category', key: 'category_name' },
        { label: 'MOQ', key: 'min_order_quantity' },
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
    },
    secondaryTable: {
      title: 'Product Categories',
      description: 'These categories power the B2B page menu and product filtering.',
      columns: [
        { label: 'Name', key: 'name' },
        { label: 'Slug', key: 'slug' },
        { label: 'Status', key: 'status' },
        { label: 'Updated', key: 'updated_at', type: 'date' }
      ],
      rows: categories,
      rowActions: (category) => `
        <div class="flex flex-wrap gap-2">
          <a class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" href="${basePath}/products?editCategory=${category.id}">Edit</a>
          <form method="post" action="${basePath}/products/categories/${category.id}/delete" class="inline-flex">
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
    category_id: toNumberOrNull(req.body.category_id),
    short_description: sanitizePlainText(req.body.short_description),
    description: sanitizeRichText(req.body.description),
    features: toJson(splitCsv(req.body.features)),
    tech_stack: toJson(splitCsv(req.body.tech_stack)),
    logo,
    images: toJson(images),
    demo_link: sanitizePlainText(req.body.demo_link),
    website_link: sanitizePlainText(req.body.website_link),
    catalog_link: sanitizePlainText(req.body.catalog_link),
    min_order_quantity: sanitizePlainText(req.body.min_order_quantity),
    unit_label: sanitizePlainText(req.body.unit_label),
    sort_order: toNumberOrNull(req.body.sort_order) ?? 0,
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
    category_id: toNumberOrNull(req.body.category_id),
    short_description: sanitizePlainText(req.body.short_description),
    description: sanitizeRichText(req.body.description),
    features: toJson(splitCsv(req.body.features)),
    tech_stack: toJson(splitCsv(req.body.tech_stack)),
    demo_link: sanitizePlainText(req.body.demo_link),
    website_link: sanitizePlainText(req.body.website_link),
    catalog_link: sanitizePlainText(req.body.catalog_link),
    min_order_quantity: sanitizePlainText(req.body.min_order_quantity),
    unit_label: sanitizePlainText(req.body.unit_label),
    sort_order: toNumberOrNull(req.body.sort_order) ?? 0,
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

async function createCategory(req, res) {
  const name = sanitizePlainText(req.body.name);
  const category = await productCategoryModel.createCategory({
    name,
    slug: sanitizePlainText(req.body.slug) || makeSlug(name, 'category'),
    description: sanitizePlainText(req.body.description),
    sort_order: toNumberOrNull(req.body.sort_order) ?? 0,
    status: sanitizePlainText(req.body.status) || 'published'
  });

  return respond(
    req,
    res,
    { message: 'Category created successfully.', category },
    `${getDashboardBasePath(req)}/products?success=Category%20created%20successfully.`
  );
}

async function updateCategory(req, res) {
  const name = sanitizePlainText(req.body.name);
  const category = await productCategoryModel.updateCategory(Number(req.params.id), {
    name,
    slug: sanitizePlainText(req.body.slug) || makeSlug(name, 'category'),
    description: sanitizePlainText(req.body.description),
    sort_order: toNumberOrNull(req.body.sort_order) ?? 0,
    status: sanitizePlainText(req.body.status) || 'published'
  });

  return respond(
    req,
    res,
    { message: 'Category updated successfully.', category },
    `${getDashboardBasePath(req)}/products?success=Category%20updated%20successfully.`
  );
}

async function deleteCategory(req, res) {
  await productCategoryModel.deleteCategory(Number(req.params.id));
  return respond(
    req,
    res,
    { message: 'Category deleted successfully.' },
    `${getDashboardBasePath(req)}/products?success=Category%20deleted%20successfully.`
  );
}

async function apiList(req, res) {
  const [products, categories] = await Promise.all([
    productModel.listAll(),
    productCategoryModel.listAll()
  ]);

  return res.json({ products, categories });
}

module.exports = {
  renderProductsPage,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  apiList
};
