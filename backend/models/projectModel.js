const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');
const { parseJsonFields, parseMany } = require('../utils/serializers');

async function listAll() {
  const rows = await query('SELECT * FROM projects ORDER BY updated_at DESC');
  return parseMany(rows, ['technologies', 'images']);
}

async function listPublished() {
  const rows = await query("SELECT * FROM projects WHERE status = 'published' ORDER BY updated_at DESC");
  return parseMany(rows, ['technologies', 'images']);
}

async function listFeatured(limit = 3) {
  const rows = await query(
    "SELECT * FROM projects WHERE status = 'published' ORDER BY updated_at DESC LIMIT ?",
    [Number(limit)]
  );
  return parseMany(rows, ['technologies', 'images']);
}

async function findBySlug(slug) {
  const row = await getOne('SELECT * FROM projects WHERE slug = ?', [slug]);
  return parseJsonFields(row, ['technologies', 'images']);
}

async function countAll() {
  const row = await getOne('SELECT COUNT(*) AS total FROM projects');
  return row?.total || 0;
}

async function createProject(data) {
  const result = await execute(
    `
      INSERT INTO projects (
        title, slug, short_description, description, client, client_industry, technologies, category,
        problem_statement, solution, results, images, featured_image, status,
        meta_title, meta_description, meta_keywords, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.title,
      data.slug,
      data.short_description,
      data.description,
      data.client,
      data.client_industry,
      data.technologies,
      data.category,
      data.problem_statement,
      data.solution,
      data.results,
      data.images,
      data.featured_image,
      data.status,
      data.meta_title,
      data.meta_description,
      data.meta_keywords,
      data.created_by,
      data.updated_by
    ]
  );

  const row = await getOne('SELECT * FROM projects WHERE id = ?', [result.insertId]);
  return parseJsonFields(row, ['technologies', 'images']);
}

async function updateProject(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE projects SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  const row = await getOne('SELECT * FROM projects WHERE id = ?', [id]);
  return parseJsonFields(row, ['technologies', 'images']);
}

async function deleteProject(id) {
  return execute('DELETE FROM projects WHERE id = ?', [id]);
}

module.exports = {
  listAll,
  listPublished,
  listFeatured,
  findBySlug,
  countAll,
  createProject,
  updateProject,
  deleteProject
};
