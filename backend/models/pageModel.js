const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');
const { parseJsonFields, parseMany } = require('../utils/serializers');

async function listAll() {
  const rows = await query('SELECT * FROM pages ORDER BY updated_at DESC');
  return parseMany(rows, ['schema_markup']);
}

async function listPublished() {
  const rows = await query("SELECT * FROM pages WHERE status = 'published' ORDER BY updated_at DESC");
  return parseMany(rows, ['schema_markup']);
}

async function findBySlug(slug) {
  const row = await getOne('SELECT * FROM pages WHERE slug = ?', [slug]);
  return parseJsonFields(row, ['schema_markup']);
}

async function createPage(data) {
  const result = await execute(
    `
      INSERT INTO pages (
        title, slug, page_type, body, template, meta_title, meta_description,
        schema_markup, og_title, og_description, canonical_url, status, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.title,
      data.slug,
      data.page_type,
      data.body,
      data.template,
      data.meta_title,
      data.meta_description,
      data.schema_markup,
      data.og_title,
      data.og_description,
      data.canonical_url,
      data.status,
      data.created_by,
      data.updated_by
    ]
  );

  const row = await getOne('SELECT * FROM pages WHERE id = ?', [result.insertId]);
  return parseJsonFields(row, ['schema_markup']);
}

async function updatePage(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE pages SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  return getOne('SELECT * FROM pages WHERE id = ?', [id]);
}

async function deletePage(id) {
  return execute('DELETE FROM pages WHERE id = ?', [id]);
}

module.exports = {
  listAll,
  listPublished,
  findBySlug,
  createPage,
  updatePage,
  deletePage
};
