const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');

async function listAll() {
  return query('SELECT * FROM product_categories ORDER BY sort_order ASC, name ASC');
}

async function listPublished() {
  return query(
    "SELECT * FROM product_categories WHERE status = 'published' ORDER BY sort_order ASC, name ASC"
  );
}

async function findById(id) {
  return getOne('SELECT * FROM product_categories WHERE id = ?', [id]);
}

async function findBySlug(slug) {
  return getOne('SELECT * FROM product_categories WHERE slug = ?', [slug]);
}

async function createCategory(data) {
  const result = await execute(
    `
      INSERT INTO product_categories (name, slug, description, sort_order, status)
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.name,
      data.slug,
      data.description,
      data.sort_order ?? 0,
      data.status || 'published'
    ]
  );

  return findById(result.insertId);
}

async function updateCategory(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE product_categories SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  return findById(id);
}

async function deleteCategory(id) {
  return execute('DELETE FROM product_categories WHERE id = ?', [id]);
}

module.exports = {
  listAll,
  listPublished,
  findById,
  findBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};
