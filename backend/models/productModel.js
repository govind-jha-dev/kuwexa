const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');
const { parseJsonFields, parseMany } = require('../utils/serializers');

const jsonFields = ['features', 'tech_stack', 'images'];

async function listAll() {
  const rows = await query('SELECT * FROM products ORDER BY updated_at DESC');
  return parseMany(rows, jsonFields);
}

async function listPublished() {
  const rows = await query("SELECT * FROM products WHERE status = 'published' ORDER BY updated_at DESC");
  return parseMany(rows, jsonFields);
}

async function listFeatured(limit = 3) {
  const rows = await query(
    "SELECT * FROM products WHERE status = 'published' ORDER BY updated_at DESC LIMIT ?",
    [Number(limit)]
  );
  return parseMany(rows, jsonFields);
}

async function findBySlug(slug) {
  const row = await getOne('SELECT * FROM products WHERE slug = ?', [slug]);
  return parseJsonFields(row, jsonFields);
}

async function countAll() {
  const row = await getOne('SELECT COUNT(*) AS total FROM products');
  return row?.total || 0;
}

async function createProduct(data) {
  const result = await execute(
    `
      INSERT INTO products (
        name, slug, short_description, description, features, tech_stack, logo, images,
        demo_link, website_link, status, meta_title, meta_description, meta_keywords, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.name,
      data.slug,
      data.short_description,
      data.description,
      data.features,
      data.tech_stack,
      data.logo,
      data.images,
      data.demo_link,
      data.website_link,
      data.status,
      data.meta_title,
      data.meta_description,
      data.meta_keywords,
      data.created_by,
      data.updated_by
    ]
  );

  const row = await getOne('SELECT * FROM products WHERE id = ?', [result.insertId]);
  return parseJsonFields(row, jsonFields);
}

async function updateProduct(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE products SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  const row = await getOne('SELECT * FROM products WHERE id = ?', [id]);
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
  countAll,
  createProduct,
  updateProduct,
  deleteProduct
};
