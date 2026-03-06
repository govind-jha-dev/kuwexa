const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');

async function listAll() {
  return query(
    `
      SELECT applications.*, jobs.title AS job_title
      FROM applications
      INNER JOIN jobs ON jobs.id = applications.job_id
      ORDER BY applications.created_at DESC
    `
  );
}

async function latest(limit = 5) {
  return query(
    `
      SELECT applications.*, jobs.title AS job_title
      FROM applications
      INNER JOIN jobs ON jobs.id = applications.job_id
      ORDER BY applications.created_at DESC
      LIMIT ?
    `,
    [Number(limit)]
  );
}

async function countAll() {
  const row = await getOne('SELECT COUNT(*) AS total FROM applications');
  return row?.total || 0;
}

async function createApplication(data) {
  const result = await execute(
    `
      INSERT INTO applications (job_id, name, email, phone, resume, cover_letter, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.job_id,
      data.name,
      data.email,
      data.phone,
      data.resume,
      data.cover_letter,
      data.status || 'new'
    ]
  );

  return getOne('SELECT * FROM applications WHERE id = ?', [result.insertId]);
}

async function updateApplication(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE applications SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  return getOne('SELECT * FROM applications WHERE id = ?', [id]);
}

module.exports = {
  listAll,
  latest,
  countAll,
  createApplication,
  updateApplication
};
