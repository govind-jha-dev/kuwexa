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

async function hasTable(connection, databaseName, tableName) {
  const [rows] = await connection.query(
    `
      SELECT 1
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
      LIMIT 1
    `,
    [databaseName, tableName]
  );

  return Boolean(rows.length);
}

async function ensureColumn(connection, databaseName, tableName, columnName, definition) {
  if (!(await hasColumn(connection, databaseName, tableName, columnName))) {
    await connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

async function ensureTeamMemberColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'team_members', 'facebook_url', 'VARCHAR(255) NULL AFTER twitter_url');
  await ensureColumn(connection, databaseName, 'team_members', 'meta_title', 'VARCHAR(255) NULL AFTER facebook_url');
  await ensureColumn(connection, databaseName, 'team_members', 'meta_description', 'TEXT NULL AFTER meta_title');
  await ensureColumn(connection, databaseName, 'team_members', 'meta_keywords', 'VARCHAR(255) NULL AFTER meta_description');
}

async function ensureWebsiteSettingColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'website_settings', 'chat_manager_user_id', 'INT NULL AFTER company_phone');
  await ensureColumn(connection, databaseName, 'website_settings', 'logo_path', 'VARCHAR(255) NULL AFTER secondary_color');
  await ensureColumn(connection, databaseName, 'website_settings', 'favicon_path', 'VARCHAR(255) NULL AFTER logo_path');
  await ensureColumn(connection, databaseName, 'website_settings', 'show_products_menu', 'TINYINT(1) NOT NULL DEFAULT 1 AFTER favicon_path');
}

async function ensureSeoColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'seo_settings', 'meta_keywords', 'VARCHAR(255) NULL AFTER meta_description');
}

async function ensurePageColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'pages', 'meta_keywords', 'VARCHAR(255) NULL AFTER meta_description');
}

async function ensureServiceColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'services', 'category', 'VARCHAR(160) NULL AFTER image');
  await ensureColumn(connection, databaseName, 'services', 'kicker', 'VARCHAR(255) NULL AFTER category');
  await ensureColumn(connection, databaseName, 'services', 'deliverables', 'JSON NULL AFTER kicker');
  await ensureColumn(connection, databaseName, 'services', 'outcomes', 'JSON NULL AFTER deliverables');
  await ensureColumn(connection, databaseName, 'services', 'process', 'JSON NULL AFTER outcomes');
  await ensureColumn(connection, databaseName, 'services', 'meta_keywords', 'VARCHAR(255) NULL AFTER meta_description');
}

async function ensureProjectColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'projects', 'short_description', 'VARCHAR(255) NULL AFTER slug');
  await ensureColumn(connection, databaseName, 'projects', 'client_industry', 'VARCHAR(160) NULL AFTER client');
  await ensureColumn(connection, databaseName, 'projects', 'problem_statement', 'LONGTEXT NULL AFTER category');
  await ensureColumn(connection, databaseName, 'projects', 'solution', 'LONGTEXT NULL AFTER problem_statement');
  await ensureColumn(connection, databaseName, 'projects', 'meta_keywords', 'VARCHAR(255) NULL AFTER meta_description');
}

async function ensureBlogColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'blog_posts', 'meta_keywords', 'VARCHAR(255) NULL AFTER meta_description');
}

async function ensureJobColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'jobs', 'meta_keywords', 'VARCHAR(255) NULL AFTER meta_description');
}

async function ensureVisitorLogColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'visitor_logs', 'request_method', 'VARCHAR(10) NULL AFTER ip_address');
  await ensureColumn(connection, databaseName, 'visitor_logs', 'country_code', 'VARCHAR(10) NULL AFTER referrer');
  await ensureColumn(connection, databaseName, 'visitor_logs', 'country_name', 'VARCHAR(120) NULL AFTER country_code');
  await ensureColumn(connection, databaseName, 'visitor_logs', 'city', 'VARCHAR(120) NULL AFTER country_name');
}

async function ensureProductsTable(connection, databaseName) {
  if (await hasTable(connection, databaseName, 'products')) {
    return;
  }

  await connection.query(`
    CREATE TABLE products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      slug VARCHAR(180) NOT NULL UNIQUE,
      short_description VARCHAR(255) NULL,
      description LONGTEXT NULL,
      features JSON NULL,
      tech_stack JSON NULL,
      logo VARCHAR(255) NULL,
      images JSON NULL,
      demo_link VARCHAR(255) NULL,
      website_link VARCHAR(255) NULL,
      status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
      meta_title VARCHAR(255) NULL,
      meta_description TEXT NULL,
      meta_keywords VARCHAR(255) NULL,
      created_by INT NULL,
      updated_by INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_products_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT fk_products_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
}

async function ensureBlockedVisitorsTable(connection, databaseName) {
  if (await hasTable(connection, databaseName, 'blocked_visitors')) {
    return;
  }

  await connection.query(`
    CREATE TABLE blocked_visitors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ip_address VARCHAR(80) NOT NULL UNIQUE,
      reason VARCHAR(255) NULL,
      created_by INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_blocked_visitors_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
}

async function ensureExtendedSchema(connection, databaseName) {
  await ensureProductsTable(connection, databaseName);
  await ensureBlockedVisitorsTable(connection, databaseName);
  await ensureTeamMemberColumns(connection, databaseName);
  await ensureWebsiteSettingColumns(connection, databaseName);
  await ensureSeoColumns(connection, databaseName);
  await ensurePageColumns(connection, databaseName);
  await ensureServiceColumns(connection, databaseName);
  await ensureProjectColumns(connection, databaseName);
  await ensureBlogColumns(connection, databaseName);
  await ensureJobColumns(connection, databaseName);
  await ensureVisitorLogColumns(connection, databaseName);
}

module.exports = {
  hasColumn,
  hasTable,
  ensureTeamMemberColumns,
  ensureWebsiteSettingColumns,
  ensureExtendedSchema
};
