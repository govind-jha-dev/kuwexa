const { query, execute, getOne } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');
const { parseJsonFields } = require('../utils/serializers');

const baseSelect = `
  SELECT
    users.*,
    roles.role_name,
    roles.permissions
  FROM users
  INNER JOIN roles ON roles.id = users.role_id
`;

function normalizeUser(row) {
  return parseJsonFields(row, ['permissions']);
}

async function findByEmail(email) {
  const row = await getOne(`${baseSelect} WHERE users.email = ?`, [email]);
  return normalizeUser(row);
}

async function findById(id) {
  const row = await getOne(`${baseSelect} WHERE users.id = ?`, [id]);
  return normalizeUser(row);
}

async function listAll() {
  const rows = await query(`${baseSelect} ORDER BY users.created_at DESC`);
  return rows.map(normalizeUser);
}

async function countAll() {
  const row = await getOne('SELECT COUNT(*) AS total FROM users');
  return row?.total || 0;
}

async function createUser(data) {
  const result = await execute(
    `
      INSERT INTO users (name, email, password, role_id, status)
      VALUES (?, ?, ?, ?, ?)
    `,
    [data.name, data.email, data.password, data.role_id, data.status || 'active']
  );

  return findById(result.insertId);
}

async function updateUser(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE users SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  return findById(id);
}

async function deleteUser(id) {
  return execute('DELETE FROM users WHERE id = ?', [id]);
}

module.exports = {
  findByEmail,
  findById,
  listAll,
  countAll,
  createUser,
  updateUser,
  deleteUser
};
