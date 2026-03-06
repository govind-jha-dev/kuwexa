const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');

async function listAll() {
  return query('SELECT * FROM leads ORDER BY created_at DESC');
}

async function latest(limit = 5) {
  return query('SELECT * FROM leads ORDER BY created_at DESC LIMIT ?', [Number(limit)]);
}

async function countAll() {
  const row = await getOne('SELECT COUNT(*) AS total FROM leads');
  return row?.total || 0;
}

async function createLead(data) {
  const result = await execute(
    `
      INSERT INTO leads (name, email, phone, message, status, source, notes, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.name,
      data.email,
      data.phone,
      data.message,
      data.status || 'new',
      data.source,
      data.notes,
      data.assigned_to || null
    ]
  );

  return getOne('SELECT * FROM leads WHERE id = ?', [result.insertId]);
}

async function updateLead(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE leads SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  return getOne('SELECT * FROM leads WHERE id = ?', [id]);
}

module.exports = {
  listAll,
  latest,
  countAll,
  createLead,
  updateLead
};
