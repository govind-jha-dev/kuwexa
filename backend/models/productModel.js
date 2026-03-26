const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');
const { parseJsonFields, parseMany } = require('../utils/serializers');

const jsonFields = ['features', 'tech_stack', 'images'];
const productSelect = `
  SELECT
    products.*,
    product_categories.name AS category_name,
    product_categories.slug AS category_slug,
    product_categories.description AS category_description,
    product_categories.status AS category_status
  FROM products
  LEFT JOIN product_categories ON product_categories.id = products.category_id
`;

async function listAll() {
  const rows = await query(
    `${productSelect} ORDER BY products.sort_order ASC, products.updated_at DESC`
  );
  return parseMany(rows, jsonFields);
}

async function listPublished() {
  const rows = await query(
    `${productSelect}
      WHERE products.status = 'published'
        AND (product_categories.status = 'published' OR products.category_id IS NULL)
      ORDER BY products.sort_order ASC, products.updated_at DESC`
  );
  return parseMany(rows, jsonFields);
}

async function listFeatured(limit = 3) {
  const rows = await query(
    `${productSelect}
      WHERE products.status = 'published'
        AND (product_categories.status = 'published' OR products.category_id IS NULL)
      ORDER BY products.sort_order ASC, products.updated_at DESC LIMIT ?`,
    [Number(limit)]
  );
  return parseMany(rows, jsonFields);
}

async function findBySlug(slug) {
  const row = await getOne(`${productSelect} WHERE products.slug = ?`, [slug]);
  return parseJsonFields(row, jsonFields);
}

async function findPublishedByIds(ids = []) {
  const cleanIds = ids.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0);
  if (!cleanIds.length) {
    return [];
  }

  const rows = await query(
    `${productSelect}
      WHERE products.status = 'published'
        AND products.id IN (?)
        AND (product_categories.status = 'published' OR products.category_id IS NULL)
      ORDER BY products.sort_order ASC, products.updated_at DESC`,
    [cleanIds]
  );

  return parseMany(rows, jsonFields);
}

async function countAll() {
  const row = await getOne('SELECT COUNT(*) AS total FROM products');
  return row?.total || 0;
}

async function countPublished() {
  const row = await getOne("SELECT COUNT(*) AS total FROM products WHERE status = 'published'");
  return row?.total || 0;
}

async function createProduct(data) {
  const result = await execute(
    `
      INSERT INTO products (
        name, slug, category_id, short_description, description, features, tech_stack, logo, images,
        demo_link, website_link, catalog_link, min_order_quantity, unit_label, sort_order,
        status, meta_title, meta_description, meta_keywords, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.name,
      data.slug,
      data.category_id ?? null,
      data.short_description,
      data.description,
      data.features,
      data.tech_stack,
      data.logo,
      data.images,
      data.demo_link,
      data.website_link,
      data.catalog_link,
      data.min_order_quantity,
      data.unit_label,
      data.sort_order ?? 0,
      data.status,
      data.meta_title,
      data.meta_description,
      data.meta_keywords,
      data.created_by,
      data.updated_by
    ]
  );

  const row = await getOne(`${productSelect} WHERE products.id = ?`, [result.insertId]);
  return parseJsonFields(row, jsonFields);
}

async function updateProduct(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE products SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  const row = await getOne(`${productSelect} WHERE products.id = ?`, [id]);
  return parseJsonFields(row, jsonFields);
}

async function deleteProduct(id) {
  return execute('DELETE FROM products WHERE id = ?', [id]);
}

module.exports = {
  listAll,
  listPublished,
  listFeatured,
  findBySlug,
  findPublishedByIds,
  countAll,
  countPublished,
  createProduct,
  updateProduct,
  deleteProduct
};
