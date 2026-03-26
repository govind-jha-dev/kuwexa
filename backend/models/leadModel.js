const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');
const { parseJsonFields, parseMany } = require('../utils/serializers');

const jsonFields = ['selected_products'];

async function listAll() {
  const rows = await query('SELECT * FROM leads ORDER BY created_at DESC');
  return parseMany(rows, jsonFields);
}

async function latest(limit = 5) {
  const rows = await query('SELECT * FROM leads ORDER BY created_at DESC LIMIT ?', [Number(limit)]);
  return parseMany(rows, jsonFields);
}

async function countAll() {
  const row = await getOne('SELECT COUNT(*) AS total FROM leads');
  return row?.total || 0;
}

async function createLead(data) {
  const result = await execute(
    `
      INSERT INTO leads (name, company_name, email, phone, message, selected_products, status, source, notes, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.name,
      data.company_name ?? null,
      data.email,
      data.phone ?? null,
      data.message,
      data.selected_products ?? null,
      data.status || 'new',
      data.source ?? null,
      data.notes ?? null,
      data.assigned_to ?? null
    ]
  );

  const row = await getOne('SELECT * FROM leads WHERE id = ?', [result.insertId]);
  return parseJsonFields(row, jsonFields);
}

async function updateLead(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE leads SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  const row = await getOne('SELECT * FROM leads WHERE id = ?', [id]);
  return parseJsonFields(row, jsonFields);
}

module.exports = {
  listAll,
  latest,
  countAll,
  createLead,
  updateLead
};
