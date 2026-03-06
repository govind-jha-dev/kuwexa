async function hasColumn(connection, databaseName, tableName, columnName) {
  const [rows] = await connection.query(
    `
      SELECT 1
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
      LIMIT 1
    `,
    [databaseName, tableName, columnName]
  );

  return Boolean(rows.length);
}

async function ensureTeamMemberColumns(connection, databaseName) {
  const needsFacebookUrl = !(await hasColumn(connection, databaseName, 'team_members', 'facebook_url'));

  if (needsFacebookUrl) {
    await connection.query('ALTER TABLE team_members ADD COLUMN facebook_url VARCHAR(255) NULL AFTER twitter_url');
  }
}

async function ensureWebsiteSettingColumns(connection, databaseName) {
  const needsChatManagerUserId = !(await hasColumn(connection, databaseName, 'website_settings', 'chat_manager_user_id'));
  const needsLogoPath = !(await hasColumn(connection, databaseName, 'website_settings', 'logo_path'));
  const needsFaviconPath = !(await hasColumn(connection, databaseName, 'website_settings', 'favicon_path'));

  if (needsChatManagerUserId) {
    await connection.query('ALTER TABLE website_settings ADD COLUMN chat_manager_user_id INT NULL AFTER company_phone');
  }

  if (needsLogoPath) {
    await connection.query('ALTER TABLE website_settings ADD COLUMN logo_path VARCHAR(255) NULL AFTER secondary_color');
  }

  if (needsFaviconPath) {
    await connection.query('ALTER TABLE website_settings ADD COLUMN favicon_path VARCHAR(255) NULL AFTER logo_path');
  }
}

module.exports = {
  ensureTeamMemberColumns,
  ensureWebsiteSettingColumns
};
