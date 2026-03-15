const { getOne, execute } = require('../config/database');
const { parseJsonFields } = require('../utils/serializers');
const { buildUpdateClause } = require('../utils/sql');

async function getSettings() {
  const row = await getOne('SELECT * FROM website_settings WHERE id = 1');
  return parseJsonFields(row, ['social_links', 'global_schema_markup']);
}

async function updateSettings(data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE website_settings SET ${updates.clause} WHERE id = 1`, updates.values);
  }

  return getSettings();
}

module.exports = {
  getSettings,
  updateSettings
};
