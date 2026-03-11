const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');

async function listAll() {
  return query('SELECT * FROM jobs ORDER BY updated_at DESC');
}

async function listOpen() {
  return query("SELECT * FROM jobs WHERE status = 'open' ORDER BY updated_at DESC");
}

async function findBySlug(slug) {
  return getOne('SELECT * FROM jobs WHERE slug = ?', [slug]);
}

async function countAll() {
  const row = await getOne('SELECT COUNT(*) AS total FROM jobs');
  return row?.total || 0;
}

async function createJob(data) {
  const result = await execute(
    `
      INSERT INTO jobs (
        title, slug, description, location, employment_type, status, meta_title, meta_description, meta_keywords
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.title,
      data.slug,
      data.description,
      data.location,
      data.employment_type,
      data.status,
      data.meta_title,
      data.meta_description,
      data.meta_keywords
    ]
  );

  return getOne('SELECT * FROM jobs WHERE id = ?', [result.insertId]);
}

async function updateJob(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE jobs SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  return getOne('SELECT * FROM jobs WHERE id = ?', [id]);
}

async function deleteJob(id) {
  return execute('DELETE FROM jobs WHERE id = ?', [id]);
}

module.exports = {
  listAll,
  listOpen,
  findBySlug,
  countAll,
  createJob,
  updateJob,
  deleteJob
};
