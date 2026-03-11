const { query, getOne, execute } = require('../config/database');

async function listAll() {
  return query(
    `
      SELECT blocked_visitors.*, users.name AS created_by_name
      FROM blocked_visitors
      LEFT JOIN users ON users.id = blocked_visitors.created_by
      ORDER BY blocked_visitors.created_at DESC
    `
  );
}

async function findByIp(ipAddress) {
  return getOne('SELECT * FROM blocked_visitors WHERE ip_address = ?', [ipAddress]);
}

async function createOrUpdate(data) {
  await execute(
    `
      INSERT INTO blocked_visitors (ip_address, reason, created_by)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        reason = VALUES(reason),
        created_by = VALUES(created_by)
    `,
    [data.ip_address, data.reason, data.created_by]
  );

  return findByIp(data.ip_address);
}

async function deleteByIp(ipAddress) {
  return execute('DELETE FROM blocked_visitors WHERE ip_address = ?', [ipAddress]);
}

module.exports = {
  listAll,
  findByIp,
  createOrUpdate,
  deleteByIp
};
