const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');
const { parseJsonFields, parseMany } = require('../utils/serializers');

async function listAll() {
  const rows = await query('SELECT * FROM services ORDER BY updated_at DESC');
  return parseMany(rows, ['schema_markup']);
}

async function listPublished() {
  return listAll();
}

async function listFeatured(limit = 3) {
  const rows = await query('SELECT * FROM services ORDER BY created_at DESC LIMIT ?', [Number(limit)]);
  return parseMany(rows, ['schema_markup']);
}

async function findBySlug(slug) {
  const row = await getOne('SELECT * FROM services WHERE slug = ?', [slug]);
  return parseJsonFields(row, ['schema_markup']);
}

async function countAll() {
  const row = await getOne('SELECT COUNT(*) AS total FROM services');
  return row?.total || 0;
}

async function createService(data) {
  const result = await execute(
    `
      INSERT INTO services (
        title, slug, short_description, description, icon, image,
        meta_title, meta_description, meta_keywords, schema_markup, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.title,
      data.slug,
      data.short_description,
      data.description,
      data.icon,
      data.image,
      data.meta_title,
      data.meta_description,
      data.meta_keywords,
      data.schema_markup,
      data.created_by,
      data.updated_by
    ]
  );

  const row = await getOne('SELECT * FROM services WHERE id = ?', [result.insertId]);
  return parseJsonFields(row, ['schema_markup']);
}

async function updateService(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE services SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  const row = await getOne('SELECT * FROM services WHERE id = ?', [id]);
  return parseJsonFields(row, ['schema_markup']);
}

async function deleteService(id) {
  return execute('DELETE FROM services WHERE id = ?', [id]);
}

module.exports = {
  listAll,
  listPublished,
  listFeatured,
  findBySlug,
  countAll,
  createService,
  updateService,
  deleteService
};
