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
  await ensureColumn(connection, databaseName, 'website_settings', 'default_meta_keywords', 'VARCHAR(255) NULL AFTER default_meta_description');
  await ensureColumn(connection, databaseName, 'website_settings', 'default_meta_robots', 'VARCHAR(255) NULL AFTER default_meta_keywords');
  await ensureColumn(connection, databaseName, 'website_settings', 'default_og_image', 'VARCHAR(255) NULL AFTER default_meta_robots');
  await ensureColumn(connection, databaseName, 'website_settings', 'default_og_image_alt', 'VARCHAR(255) NULL AFTER default_og_image');
  await ensureColumn(connection, databaseName, 'website_settings', 'default_twitter_card', 'VARCHAR(60) NULL AFTER default_og_image_alt');
  await ensureColumn(connection, databaseName, 'website_settings', 'twitter_site', 'VARCHAR(120) NULL AFTER default_twitter_card');
  await ensureColumn(connection, databaseName, 'website_settings', 'twitter_creator', 'VARCHAR(120) NULL AFTER twitter_site');
  await ensureColumn(connection, databaseName, 'website_settings', 'bing_webmaster_tag', 'VARCHAR(255) NULL AFTER search_console_tag');
  await ensureColumn(connection, databaseName, 'website_settings', 'yandex_verification_tag', 'VARCHAR(255) NULL AFTER bing_webmaster_tag');
  await ensureColumn(connection, databaseName, 'website_settings', 'pinterest_verification_tag', 'VARCHAR(255) NULL AFTER yandex_verification_tag');
  await ensureColumn(connection, databaseName, 'website_settings', 'facebook_domain_verification', 'VARCHAR(255) NULL AFTER pinterest_verification_tag');
  await ensureColumn(connection, databaseName, 'website_settings', 'global_schema_markup', 'JSON NULL AFTER facebook_domain_verification');
  await ensureColumn(connection, databaseName, 'website_settings', 'robots_txt', 'LONGTEXT NULL AFTER global_schema_markup');
}

async function ensureSeoColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'seo_settings', 'meta_keywords', 'VARCHAR(255) NULL AFTER meta_description');
  await ensureColumn(connection, databaseName, 'seo_settings', 'focus_keyword', 'VARCHAR(180) NULL AFTER meta_keywords');
  await ensureColumn(connection, databaseName, 'seo_settings', 'meta_robots', 'VARCHAR(255) NULL AFTER focus_keyword');
  await ensureColumn(connection, databaseName, 'seo_settings', 'og_type', 'VARCHAR(60) NULL AFTER schema_markup');
  await ensureColumn(connection, databaseName, 'seo_settings', 'og_image', 'VARCHAR(255) NULL AFTER og_description');
  await ensureColumn(connection, databaseName, 'seo_settings', 'og_image_alt', 'VARCHAR(255) NULL AFTER og_image');
  await ensureColumn(connection, databaseName, 'seo_settings', 'twitter_card', 'VARCHAR(60) NULL AFTER og_image_alt');
  await ensureColumn(connection, databaseName, 'seo_settings', 'twitter_title', 'VARCHAR(255) NULL AFTER twitter_card');
  await ensureColumn(connection, databaseName, 'seo_settings', 'twitter_description', 'TEXT NULL AFTER twitter_title');
  await ensureColumn(connection, databaseName, 'seo_settings', 'twitter_image', 'VARCHAR(255) NULL AFTER twitter_description');
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

async function ensureLeadColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'leads', 'company_name', 'VARCHAR(160) NULL AFTER name');
  await ensureColumn(connection, databaseName, 'leads', 'selected_products', 'JSON NULL AFTER message');
}

async function ensureVisitorLogColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'visitor_logs', 'request_method', 'VARCHAR(10) NULL AFTER ip_address');
  await ensureColumn(connection, databaseName, 'visitor_logs', 'country_code', 'VARCHAR(10) NULL AFTER referrer');
  await ensureColumn(connection, databaseName, 'visitor_logs', 'country_name', 'VARCHAR(120) NULL AFTER country_code');
  await ensureColumn(connection, databaseName, 'visitor_logs', 'city', 'VARCHAR(120) NULL AFTER country_name');
}

async function ensureProductCategoriesTable(connection, databaseName) {
  if (await hasTable(connection, databaseName, 'product_categories')) {
    return;
  }

  await connection.query(`
    CREATE TABLE product_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      slug VARCHAR(180) NOT NULL UNIQUE,
      description TEXT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      status ENUM('draft', 'published') NOT NULL DEFAULT 'published',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
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
      category_id INT NULL,
      short_description VARCHAR(255) NULL,
      description LONGTEXT NULL,
      features JSON NULL,
      tech_stack JSON NULL,
      logo VARCHAR(255) NULL,
      images JSON NULL,
      demo_link VARCHAR(255) NULL,
      website_link VARCHAR(255) NULL,
      catalog_link VARCHAR(255) NULL,
      min_order_quantity VARCHAR(80) NULL,
      unit_label VARCHAR(80) NULL,
      sort_order INT NOT NULL DEFAULT 0,
      status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
      meta_title VARCHAR(255) NULL,
      meta_description TEXT NULL,
      meta_keywords VARCHAR(255) NULL,
      created_by INT NULL,
      updated_by INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
      CONSTRAINT fk_products_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
      CONSTRAINT fk_products_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
}

async function ensureProductColumns(connection, databaseName) {
  await ensureColumn(connection, databaseName, 'products', 'category_id', 'INT NULL AFTER slug');
  await ensureColumn(connection, databaseName, 'products', 'catalog_link', 'VARCHAR(255) NULL AFTER website_link');
  await ensureColumn(connection, databaseName, 'products', 'min_order_quantity', 'VARCHAR(80) NULL AFTER catalog_link');
  await ensureColumn(connection, databaseName, 'products', 'unit_label', 'VARCHAR(80) NULL AFTER min_order_quantity');
  await ensureColumn(connection, databaseName, 'products', 'sort_order', 'INT NOT NULL DEFAULT 0 AFTER unit_label');

  const [constraintRows] = await connection.query(
    `
      SELECT 1
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'products'
        AND COLUMN_NAME = 'category_id'
        AND REFERENCED_TABLE_NAME = 'product_categories'
      LIMIT 1
    `,
    [databaseName]
  );

  if (!constraintRows.length) {
    await connection.query(
      'ALTER TABLE products ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL'
    );
  }
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

async function ensureMediaAssetsTable(connection, databaseName) {
  if (await hasTable(connection, databaseName, 'media_assets')) {
    return;
  }

  await connection.query(`
    CREATE TABLE media_assets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      file_path VARCHAR(255) NOT NULL UNIQUE,
      title VARCHAR(160) NULL,
      alt_text VARCHAR(255) NULL,
      source_module VARCHAR(80) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

async function ensureExtendedSchema(connection, databaseName) {
  await ensureProductCategoriesTable(connection, databaseName);
  await ensureProductsTable(connection, databaseName);
  await ensureBlockedVisitorsTable(connection, databaseName);
  await ensureMediaAssetsTable(connection, databaseName);
  await ensureTeamMemberColumns(connection, databaseName);
  await ensureWebsiteSettingColumns(connection, databaseName);
  await ensureSeoColumns(connection, databaseName);
  await ensurePageColumns(connection, databaseName);
  await ensureServiceColumns(connection, databaseName);
  await ensureProjectColumns(connection, databaseName);
  await ensureBlogColumns(connection, databaseName);
  await ensureJobColumns(connection, databaseName);
  await ensureLeadColumns(connection, databaseName);
  await ensureProductColumns(connection, databaseName);
  await ensureVisitorLogColumns(connection, databaseName);
}

module.exports = {
  hasColumn,
  hasTable,
  ensureTeamMemberColumns,
  ensureWebsiteSettingColumns,
  ensureMediaAssetsTable,
  ensureExtendedSchema
};
