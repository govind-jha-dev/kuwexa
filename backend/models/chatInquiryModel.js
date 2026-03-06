const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');

const baseSelect = `
  SELECT
    chat_inquiries.*,
    users.name AS manager_name,
    users.email AS manager_email
  FROM chat_inquiries
  LEFT JOIN users ON users.id = chat_inquiries.manager_user_id
`;

async function listAll() {
  return query(`${baseSelect} ORDER BY chat_inquiries.updated_at DESC`);
}

async function listForManager(managerUserId) {
  return query(`${baseSelect} WHERE chat_inquiries.manager_user_id = ? ORDER BY chat_inquiries.updated_at DESC`, [managerUserId]);
}

async function countAll() {
  const row = await getOne('SELECT COUNT(*) AS total FROM chat_inquiries');
  return row?.total || 0;
}

async function createChat(data) {
  const result = await execute(
    `
      INSERT INTO chat_inquiries (
        name, email, phone, topic, message, page_path, status, manager_notes, manager_user_id, notified_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.name,
      data.email,
      data.phone,
      data.topic,
      data.message,
      data.page_path,
      data.status || 'new',
      data.manager_notes || null,
      data.manager_user_id || null,
      data.notified_at || null
    ]
  );

  return getOne(`${baseSelect} WHERE chat_inquiries.id = ?`, [result.insertId]);
}

async function updateChat(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE chat_inquiries SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  return getOne(`${baseSelect} WHERE chat_inquiries.id = ?`, [id]);
}

module.exports = {
  listAll,
  listForManager,
  countAll,
  createChat,
  updateChat
};
