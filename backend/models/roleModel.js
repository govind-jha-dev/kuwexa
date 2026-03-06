const { query } = require('../config/database');
const { parseMany } = require('../utils/serializers');

async function listAll() {
  const rows = await query('SELECT * FROM roles ORDER BY role_name ASC');
  return parseMany(rows, ['permissions']);
}

module.exports = {
  listAll
};
