CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  permissions JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS media_assets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_path VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(160) NULL,
  alt_text VARCHAR(255) NULL,
  source_module VARCHAR(80) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS website_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(120) NOT NULL DEFAULT 'Kuwexa Private Limited',
  company_email VARCHAR(160) NULL,
  company_phone VARCHAR(50) NULL,
  chat_manager_user_id INT NULL,
  address VARCHAR(255) NULL,
  hero_title VARCHAR(255) NULL,
  hero_subtitle TEXT NULL,
  primary_color VARCHAR(20) NOT NULL DEFAULT '#00240a',
  secondary_color VARCHAR(20) NOT NULL DEFAULT '#dbab0d',
  logo_path VARCHAR(255) NULL,
  favicon_path VARCHAR(255) NULL,
  show_products_menu TINYINT(1) NOT NULL DEFAULT 1,
  analytics_id VARCHAR(120) NULL,
  search_console_tag VARCHAR(255) NULL,
  default_meta_title VARCHAR(255) NULL,
  default_meta_description TEXT NULL,
  default_meta_keywords VARCHAR(255) NULL,
  default_meta_robots VARCHAR(255) NULL,
  default_og_image VARCHAR(255) NULL,
  default_og_image_alt VARCHAR(255) NULL,
  default_twitter_card VARCHAR(60) NULL,
  twitter_site VARCHAR(120) NULL,
  twitter_creator VARCHAR(120) NULL,
  bing_webmaster_tag VARCHAR(255) NULL,
  yandex_verification_tag VARCHAR(255) NULL,
  pinterest_verification_tag VARCHAR(255) NULL,
  facebook_domain_verification VARCHAR(255) NULL,
  global_schema_markup JSON NULL,
  robots_txt LONGTEXT NULL,
  social_links JSON NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  page_type ENUM('page', 'policy', 'landing') NOT NULL DEFAULT 'page',
  body LONGTEXT NULL,
  template VARCHAR(100) NULL,
  meta_title VARCHAR(255) NULL,
  meta_description TEXT NULL,
  meta_keywords VARCHAR(255) NULL,
  schema_markup JSON NULL,
  og_title VARCHAR(255) NULL,
  og_description TEXT NULL,
  canonical_url VARCHAR(255) NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pages_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_pages_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  short_description VARCHAR(255) NULL,
  description LONGTEXT NULL,
  icon VARCHAR(100) NULL,
  image VARCHAR(255) NULL,
  category VARCHAR(160) NULL,
  kicker VARCHAR(255) NULL,
  deliverables JSON NULL,
  outcomes JSON NULL,
  process JSON NULL,
  meta_title VARCHAR(255) NULL,
  meta_description TEXT NULL,
  meta_keywords VARCHAR(255) NULL,
  schema_markup JSON NULL,
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_services_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_services_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  description TEXT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
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
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  short_description VARCHAR(255) NULL,
  description LONGTEXT NULL,
  client VARCHAR(160) NULL,
  client_industry VARCHAR(160) NULL,
  technologies JSON NULL,
  category VARCHAR(120) NULL,
  problem_statement LONGTEXT NULL,
  solution LONGTEXT NULL,
  results LONGTEXT NULL,
  images JSON NULL,
  featured_image VARCHAR(255) NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  meta_title VARCHAR(255) NULL,
  meta_description TEXT NULL,
  meta_keywords VARCHAR(255) NULL,
  created_by INT NULL,
  updated_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_projects_updated_by FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  excerpt TEXT NULL,
  content LONGTEXT NULL,
  author_id INT NULL,
  category VARCHAR(120) NULL,
  tags JSON NULL,
  featured_image VARCHAR(255) NULL,
  meta_title VARCHAR(255) NULL,
  meta_description TEXT NULL,
  meta_keywords VARCHAR(255) NULL,
  schema_markup JSON NULL,
  og_title VARCHAR(255) NULL,
  og_description TEXT NULL,
  canonical_url VARCHAR(255) NULL,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_blog_posts_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  company_name VARCHAR(160) NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(50) NULL,
  message TEXT NOT NULL,
  selected_products JSON NULL,
  status ENUM('new', 'contacted', 'qualified', 'closed') NOT NULL DEFAULT 'new',
  source VARCHAR(120) NULL,
  notes TEXT NULL,
  assigned_to INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_leads_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  description LONGTEXT NOT NULL,
  location VARCHAR(160) NULL,
  employment_type VARCHAR(100) NULL,
  status ENUM('draft', 'open', 'closed') NOT NULL DEFAULT 'draft',
  meta_title VARCHAR(255) NULL,
  meta_description TEXT NULL,
  meta_keywords VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(50) NULL,
  resume VARCHAR(255) NOT NULL,
  cover_letter LONGTEXT NULL,
  status ENUM('new', 'reviewed', 'interview_scheduled', 'rejected', 'selected') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(140) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  member_type ENUM('leadership', 'employee') NOT NULL DEFAULT 'employee',
  designation VARCHAR(160) NOT NULL,
  department VARCHAR(160) NULL,
  short_bio VARCHAR(255) NULL,
  bio LONGTEXT NULL,
  email VARCHAR(160) NULL,
  phone VARCHAR(50) NULL,
  image VARCHAR(255) NULL,
  linkedin_url VARCHAR(255) NULL,
  twitter_url VARCHAR(255) NULL,
  facebook_url VARCHAR(255) NULL,
  meta_title VARCHAR(255) NULL,
  meta_description TEXT NULL,
  meta_keywords VARCHAR(255) NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(50) NULL,
  topic VARCHAR(160) NULL,
  message TEXT NOT NULL,
  page_path VARCHAR(255) NULL,
  status ENUM('new', 'replied', 'closed') NOT NULL DEFAULT 'new',
  manager_notes TEXT NULL,
  manager_user_id INT NULL,
  notified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_chat_inquiries_manager FOREIGN KEY (manager_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS seo_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_key VARCHAR(120) NOT NULL UNIQUE,
  meta_title VARCHAR(255) NULL,
  meta_description TEXT NULL,
  meta_keywords VARCHAR(255) NULL,
  focus_keyword VARCHAR(180) NULL,
  meta_robots VARCHAR(255) NULL,
  slug VARCHAR(180) NULL,
  schema_markup JSON NULL,
  og_type VARCHAR(60) NULL,
  og_title VARCHAR(255) NULL,
  og_description TEXT NULL,
  og_image VARCHAR(255) NULL,
  og_image_alt VARCHAR(255) NULL,
  twitter_card VARCHAR(60) NULL,
  twitter_title VARCHAR(255) NULL,
  twitter_description TEXT NULL,
  twitter_image VARCHAR(255) NULL,
  canonical_url VARCHAR(255) NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visitor_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  path VARCHAR(255) NOT NULL,
  ip_address VARCHAR(80) NULL,
  request_method VARCHAR(10) NULL,
  user_agent VARCHAR(255) NULL,
  referrer VARCHAR(255) NULL,
  country_code VARCHAR(10) NULL,
  country_name VARCHAR(120) NULL,
  city VARCHAR(120) NULL,
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_visitor_logs_path (path),
  INDEX idx_visitor_logs_visited_at (visited_at),
  INDEX idx_visitor_logs_ip_address (ip_address)
);

CREATE TABLE IF NOT EXISTS blocked_visitors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(80) NOT NULL UNIQUE,
  reason VARCHAR(255) NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_blocked_visitors_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO website_settings (
  id,
  company_name,
  hero_title,
  hero_subtitle,
  primary_color,
  secondary_color,
  default_meta_title,
  default_meta_description,
  default_meta_keywords,
  default_meta_robots,
  default_twitter_card,
  robots_txt
)
VALUES (
  1,
  'Kuwexa Private Limited',
  'One Parent Company. Three Focused Divisions.',
  'Kuwexa Private Limited introduces the parent company, presents CodexWEBZ and Kuwexa Lifestyle as focused divisions, and runs a dashboard-managed B2B product catalog for wholesale enquiries.',
  '#00240a',
  '#dbab0d',
  'Kuwexa Private Limited | Parent Company for CodexWEBZ, Kuwexa Lifestyle, and Kuwexa B2B',
  'Kuwexa Private Limited is the parent company website for CodexWEBZ, Kuwexa Lifestyle, and a B2B catalog with category-led product enquiries.',
  'kuwexa, codexwebz, kuwexa lifestyle, b2b catalog, dry fruits, spices, woollen products, cereals grains',
  'index, follow, max-image-preview:large',
  'summary_large_image',
  'User-agent: *\nAllow: /'
)
ON DUPLICATE KEY UPDATE
  company_name = VALUES(company_name),
  hero_title = VALUES(hero_title),
  hero_subtitle = VALUES(hero_subtitle),
  primary_color = VALUES(primary_color),
  secondary_color = VALUES(secondary_color),
  default_meta_title = VALUES(default_meta_title),
  default_meta_description = VALUES(default_meta_description),
  default_meta_keywords = VALUES(default_meta_keywords),
  default_meta_robots = VALUES(default_meta_robots),
  default_twitter_card = VALUES(default_twitter_card),
  robots_txt = VALUES(robots_txt);

INSERT INTO seo_settings (
  page_key,
  meta_title,
  meta_description,
  slug,
  canonical_url
)
VALUES
  ('home', 'Kuwexa Private Limited | Systems for Scalable Global Commerce', 'Kuwexa Private Limited combines global trade, consumer commerce, and digital innovation to help businesses scale with structure.', '', '/'),
  ('about', 'About Kuwexa Private Limited | Hybrid Commerce and Digital Innovation', 'Learn how Kuwexa Private Limited connects global trade, ecommerce, and technology enablement through a hybrid operating model.', 'about-us', '/about-us'),
  ('team', 'Leadership | Kuwexa Private Limited', 'Meet the leadership and delivery team guiding Kuwexa Private Limited and its operating ecosystem.', 'team', '/team'),
  ('divisions', 'Company Divisions | Kuwexa Private Limited', 'Explore Kuwexa divisions including CodexWEBZ, Kuwexa Lifestyle, and the Kuwexa B2B product catalog.', 'divisions', '/divisions'),
  ('b2b', 'Kuwexa B2B | Product Categories and Enquiries', 'Browse the Kuwexa B2B product catalog by category and submit a multi-product enquiry directly from the website.', 'b2b', '/b2b'),
  ('services', 'Capabilities | Kuwexa Private Limited', 'Explore Kuwexa capabilities across digital innovation, ecommerce enablement, and business technology delivery.', 'services', '/services'),
  ('products', 'Platforms | Kuwexa Private Limited', 'Explore digital products, platforms, and managed solutions presented within the Kuwexa ecosystem.', 'products', '/products'),
  ('projects', 'Initiatives | Kuwexa Private Limited', 'See Kuwexa initiatives, execution stories, and platform delivery work.', 'projects', '/portfolio'),
  ('portfolio', 'Initiatives | Kuwexa Private Limited', 'See Kuwexa initiatives, execution stories, and platform delivery work.', 'projects', '/portfolio'),
  ('blog', 'Insights | Kuwexa Private Limited', 'Insights on global commerce, digital systems, and operationally scalable growth.', 'blog', '/blog'),
  ('careers', 'Careers | Kuwexa Private Limited', 'Join Kuwexa Private Limited and help build scalable commerce and digital systems.', 'careers', '/careers'),
  ('contact', 'Contact Kuwexa Private Limited', 'Start a conversation with Kuwexa about trade enablement, digital platforms, or long-term growth systems.', 'contact', '/contact')
ON DUPLICATE KEY UPDATE
  meta_title = VALUES(meta_title),
  meta_description = VALUES(meta_description),
  slug = VALUES(slug),
  canonical_url = VALUES(canonical_url);
