require('dotenv').config();

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const { ensureExtendedSchema } = require('../backend/services/schemaMaintenanceService');
const { splitSchemaSections } = require('../backend/services/databaseBootstrapService');
const { resolveServiceProfile } = require('../backend/services/siteContentService');

const permissions = {
  super_admin: [
    'dashboard.view',
    'users.manage',
    'settings.manage',
    'pages.manage',
    'services.manage',
    'products.manage',
    'portfolio.manage',
    'team.manage',
    'chats.manage',
    'blog.manage',
    'leads.manage',
    'careers.manage',
    'seo.manage',
    'analytics.view'
  ],
  manager: [
    'dashboard.view',
    'services.manage',
    'products.manage',
    'portfolio.manage',
    'team.manage',
    'chats.manage',
    'blog.manage',
    'leads.manage',
    'careers.manage',
    'analytics.view'
  ],
  editor: [
    'dashboard.view',
    'blog.manage'
  ]
};

async function upsertService(connection, payload) {
  const [
    title,
    slug,
    shortDescription,
    description,
    icon,
    metaTitle,
    metaDescription,
    metaKeywords,
    createdBy,
    updatedBy
  ] = payload;
  const profile = resolveServiceProfile({ title, slug });

  await connection.query(
    `
      INSERT INTO services (
        title, slug, short_description, description, icon, category, kicker,
        deliverables, outcomes, process, meta_title, meta_description, meta_keywords, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        short_description = VALUES(short_description),
        description = VALUES(description),
        icon = VALUES(icon),
        category = VALUES(category),
        kicker = VALUES(kicker),
        deliverables = VALUES(deliverables),
        outcomes = VALUES(outcomes),
        process = VALUES(process),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        meta_keywords = VALUES(meta_keywords),
        updated_by = VALUES(updated_by)
    `,
    [
      title,
      slug,
      shortDescription,
      description,
      icon,
      profile.category,
      profile.kicker,
      JSON.stringify(profile.deliverables || []),
      JSON.stringify(profile.outcomes || []),
      JSON.stringify(profile.process || []),
      metaTitle,
      metaDescription,
      metaKeywords,
      createdBy,
      updatedBy
    ]
  );
}

async function upsertProduct(connection, payload) {
  await connection.query(
    `
      INSERT INTO products (
        name, slug, short_description, description, features, tech_stack, logo, images,
        demo_link, website_link, status, meta_title, meta_description, meta_keywords, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        short_description = VALUES(short_description),
        description = VALUES(description),
        features = VALUES(features),
        tech_stack = VALUES(tech_stack),
        logo = VALUES(logo),
        images = VALUES(images),
        demo_link = VALUES(demo_link),
        website_link = VALUES(website_link),
        status = VALUES(status),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        meta_keywords = VALUES(meta_keywords),
        updated_by = VALUES(updated_by)
    `,
    payload
  );
}

async function upsertProject(connection, payload) {
  await connection.query(
    `
      INSERT INTO projects (
        title, slug, short_description, description, client, client_industry, technologies, category,
        problem_statement, solution, results, status, meta_title, meta_description, meta_keywords, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        short_description = VALUES(short_description),
        description = VALUES(description),
        client = VALUES(client),
        client_industry = VALUES(client_industry),
        technologies = VALUES(technologies),
        category = VALUES(category),
        problem_statement = VALUES(problem_statement),
        solution = VALUES(solution),
        results = VALUES(results),
        status = VALUES(status),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        meta_keywords = VALUES(meta_keywords),
        updated_by = VALUES(updated_by)
    `,
    payload
  );
}

async function upsertPost(connection, payload) {
  await connection.query(
    `
      INSERT INTO blog_posts (
        title, slug, excerpt, content, author_id, category, tags, meta_title, meta_description,
        meta_keywords, status, published_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        excerpt = VALUES(excerpt),
        content = VALUES(content),
        author_id = VALUES(author_id),
        category = VALUES(category),
        tags = VALUES(tags),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        meta_keywords = VALUES(meta_keywords),
        status = VALUES(status),
        published_at = VALUES(published_at)
    `,
    payload
  );
}

async function upsertTeamMember(connection, payload) {
  await connection.query(
    `
      INSERT INTO team_members (
        name, slug, member_type, designation, department, short_bio, bio,
        email, phone, image, linkedin_url, twitter_url, facebook_url,
        meta_title, meta_description, meta_keywords, status, sort_order
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        member_type = VALUES(member_type),
        designation = VALUES(designation),
        department = VALUES(department),
        short_bio = VALUES(short_bio),
        bio = VALUES(bio),
        email = VALUES(email),
        phone = VALUES(phone),
        image = VALUES(image),
        linkedin_url = VALUES(linkedin_url),
        twitter_url = VALUES(twitter_url),
        facebook_url = VALUES(facebook_url),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        meta_keywords = VALUES(meta_keywords),
        status = VALUES(status),
        sort_order = VALUES(sort_order)
    `,
    payload
  );
}

async function upsertJob(connection, payload) {
  await connection.query(
    `
      INSERT INTO jobs (
        title, slug, description, location, employment_type, status, meta_title, meta_description, meta_keywords
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        location = VALUES(location),
        employment_type = VALUES(employment_type),
        status = VALUES(status),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        meta_keywords = VALUES(meta_keywords)
    `,
    payload
  );
}

async function run() {
  const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
  } = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error('Database environment variables are incomplete.');
  }

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT || 3306),
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await connection.changeUser({ database: DB_NAME });

  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  const { structureSql, dataSql } = splitSchemaSections(schema);
  if (structureSql.trim()) {
    await connection.query(structureSql);
  }
  await ensureExtendedSchema(connection, DB_NAME);
  if (dataSql.trim()) {
    await connection.query(dataSql);
  }

  for (const [roleName, rolePermissions] of Object.entries(permissions)) {
    await connection.query(
      `
        INSERT INTO roles (role_name, permissions)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE permissions = VALUES(permissions)
      `,
      [roleName, JSON.stringify(rolePermissions)]
    );
  }

  const [roles] = await connection.query('SELECT id, role_name FROM roles');
  const roleMap = Object.fromEntries(roles.map((role) => [role.role_name, role.id]));

  const defaultPassword = await bcrypt.hash('ChangeMe123!', 12);
  const users = [
    ['Super Admin', 'admin@kuwexa.com', defaultPassword, roleMap.super_admin],
    ['Manager', 'manager@kuwexa.com', defaultPassword, roleMap.manager],
    ['Editor', 'editor@kuwexa.com', defaultPassword, roleMap.editor]
  ];

  for (const [name, email, password, roleId] of users) {
    await connection.query(
      `
        INSERT INTO users (name, email, password, role_id, status)
        VALUES (?, ?, ?, ?, 'active')
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          password = VALUES(password),
          role_id = VALUES(role_id),
          status = 'active'
      `,
      [name, email, password, roleId]
    );
  }

  const [seedUsers] = await connection.query('SELECT id, email FROM users');
  const userMap = Object.fromEntries(seedUsers.map((user) => [user.email, user.id]));
  const adminUserId = userMap['admin@kuwexa.com'];
  const managerUserId = userMap['manager@kuwexa.com'];

  await connection.query(
    `
      UPDATE website_settings
      SET
        company_name = 'Kuwexa Private Limited',
        hero_title = 'Systems for Scalable Global Commerce',
        hero_subtitle = 'Kuwexa Private Limited connects global trade, consumer commerce, and digital systems to help businesses grow with more structure, clarity, and long-term sustainability.',
        default_meta_title = 'Kuwexa Private Limited | Systems for Scalable Global Commerce',
        default_meta_description = 'Kuwexa Private Limited builds scalable systems for global commerce across trade enablement, digital platforms, ecommerce experiences, and operational technology.',
        default_meta_keywords = 'kuwexa, global commerce, digital systems, ecommerce, trade enablement, technology platforms',
        default_meta_robots = 'index, follow, max-image-preview:large',
        default_twitter_card = 'summary_large_image',
        robots_txt = 'User-agent: *\nAllow: /',
        chat_manager_user_id = ?,
        show_products_menu = 1
      WHERE id = 1
    `,
    [managerUserId]
  );

  await connection.query(
    `
      DELETE FROM services
      WHERE slug IN (
        'web-platform-engineering',
        'seo-editorial-systems',
        'lead-workflow-automation',
        'content-led-growth-pages'
      )
    `
  );

  const services = [
    [
      'Website Development',
      'website-development',
      'Business websites, corporate sites, landing pages, portfolio sites, custom web applications, and progressive web apps built for real business use.',
      `
        <h2>Web development for practical business growth</h2>
        <p>Kuwexa develops websites and web platforms that help businesses establish stronger digital presence, improve credibility, and support long-term growth.</p>
        <h3>Included services</h3>
        <ul>
          <li>Website Development</li>
          <li>Custom Website Design</li>
          <li>Business Website Development</li>
          <li>Corporate Website Development</li>
          <li>Landing Page Development</li>
          <li>Portfolio Website Development</li>
          <li>Web Application Development</li>
          <li>Custom Web Application Development</li>
          <li>Progressive Web Apps (PWA)</li>
        </ul>
      `,
      'Web Build',
      'Website Development | Kuwexa',
      'Website development and custom web application services for businesses building stronger digital presence.',
      'website development, business website, web application development, pwa',
      adminUserId,
      adminUserId
    ],
    [
      'Ecommerce Solutions',
      'ecommerce-solutions',
      'Ecommerce websites, store setup, product catalog management, seller account setup, and marketplace integration for businesses selling online.',
      `
        <h2>Ecommerce systems that support online selling</h2>
        <p>Kuwexa helps businesses launch and manage ecommerce platforms that combine storefront quality, operational clarity, and marketplace readiness.</p>
        <h3>Included services</h3>
        <ul>
          <li>Ecommerce Website Development</li>
          <li>Ecommerce Platform Setup</li>
          <li>Online Store Development</li>
          <li>Product Catalog Management</li>
          <li>Payment Gateway Integration</li>
          <li>Ecommerce Seller Account Setup</li>
          <li>Amazon Seller Account Setup</li>
          <li>Flipkart Seller Account Setup</li>
          <li>Marketplace Integration</li>
        </ul>
      `,
      'Ecommerce',
      'Ecommerce Solutions | Kuwexa',
      'Ecommerce website development, seller setup, catalog management, and marketplace integration services.',
      'ecommerce development, amazon seller account setup, flipkart seller account setup, online store development',
      adminUserId,
      adminUserId
    ],
    [
      'Custom Software Development',
      'custom-software-development',
      'Business software, CRM systems, SaaS platforms, internal tools, and API integrations designed around operational requirements.',
      `
        <h2>Software built around business operations</h2>
        <p>Kuwexa develops custom software solutions that help businesses streamline workflows, centralize information, and build scalable internal systems.</p>
        <h3>Included services</h3>
        <ul>
          <li>Custom Software Development</li>
          <li>Business Software Solutions</li>
          <li>CRM Development</li>
          <li>Internal Business Systems</li>
          <li>API Integration</li>
          <li>SaaS Platform Development</li>
        </ul>
      `,
      'Software',
      'Custom Software Development | Kuwexa',
      'Custom software, CRM, SaaS platform, and API integration services for growing businesses.',
      'custom software development, crm development, saas platform development, api integration',
      adminUserId,
      adminUserId
    ],
    [
      'Mobile Application Development',
      'mobile-application-development',
      'Android apps, iOS apps, cross-platform mobile applications, and business mobile solutions for customer and internal use.',
      `
        <h2>Mobile applications for modern business needs</h2>
        <p>Kuwexa delivers mobile applications that help businesses reach customers on smartphones and support internal workflows through mobile-first systems.</p>
        <h3>Included services</h3>
        <ul>
          <li>Android App Development</li>
          <li>iOS App Development</li>
          <li>Cross Platform Mobile Apps</li>
          <li>Business Mobile Applications</li>
        </ul>
      `,
      'Mobile Apps',
      'Mobile Application Development | Kuwexa',
      'Android, iOS, and cross-platform mobile app development for business use cases.',
      'mobile app development, android app development, ios app development, cross platform apps',
      adminUserId,
      adminUserId
    ],
    [
      'SEO and Digital Marketing',
      'seo-and-digital-marketing',
      'SEO, technical SEO, local SEO, digital marketing strategy, and lead generation support to improve visibility and acquisition.',
      `
        <h2>Visibility and growth support for service businesses</h2>
        <p>Kuwexa helps businesses improve discoverability, strengthen search performance, and support lead generation with structured digital marketing services.</p>
        <h3>Included services</h3>
        <ul>
          <li>Search Engine Optimization (SEO)</li>
          <li>Technical SEO</li>
          <li>Local SEO</li>
          <li>Digital Marketing Strategy</li>
          <li>Lead Generation Marketing</li>
        </ul>
      `,
      'SEO Growth',
      'SEO and Digital Marketing | Kuwexa',
      'SEO, local SEO, technical SEO, and digital marketing strategy services for business growth.',
      'seo services, technical seo, local seo, lead generation marketing',
      adminUserId,
      adminUserId
    ],
    [
      'Social Media and Branding',
      'social-media-and-branding',
      'Social media marketing, brand development, brand strategy, and social media management for stronger public presence.',
      `
        <h2>Brand and social visibility support</h2>
        <p>Kuwexa helps businesses communicate more clearly through social media support, stronger brand direction, and consistent online positioning.</p>
        <h3>Included services</h3>
        <ul>
          <li>Social Media Marketing</li>
          <li>Social Media Management</li>
          <li>Brand Development</li>
          <li>Online Branding Strategy</li>
        </ul>
      `,
      'Branding',
      'Social Media and Branding | Kuwexa',
      'Social media marketing, branding, and online brand strategy services for businesses.',
      'social media marketing, brand development, social media management, online branding strategy',
      adminUserId,
      adminUserId
    ],
    [
      'Creative and Content Services',
      'creative-and-content-services',
      'Graphic design, UI/UX design, video editing, content writing, and marketing content creation for websites and campaigns.',
      `
        <h2>Creative support that strengthens digital presentation</h2>
        <p>Kuwexa supports businesses with design and content services that improve website quality, campaign clarity, and brand communication.</p>
        <h3>Included services</h3>
        <ul>
          <li>Graphic Designing</li>
          <li>UI/UX Design</li>
          <li>Video Editing</li>
          <li>Content Writing</li>
          <li>Marketing Content Creation</li>
        </ul>
      `,
      'Creative',
      'Creative and Content Services | Kuwexa',
      'Graphic design, UI/UX, video editing, content writing, and marketing content services.',
      'graphic design, ui ux design, video editing, content writing, marketing content creation',
      adminUserId,
      adminUserId
    ],
    [
      'Website Support and Maintenance',
      'website-support-and-maintenance',
      'Maintenance, technical support, security updates, performance optimization, and troubleshooting for active platforms.',
      `
        <h2>Reliable support after launch</h2>
        <p>Kuwexa provides maintenance and support services that help businesses keep websites and digital systems stable, secure, and efficient over time.</p>
        <h3>Included services</h3>
        <ul>
          <li>Website Maintenance</li>
          <li>Technical Support</li>
          <li>Website Security Updates</li>
          <li>Website Performance Optimization</li>
          <li>Bug Fixing and Troubleshooting</li>
        </ul>
      `,
      'Support',
      'Website Support and Maintenance | Kuwexa',
      'Website maintenance, support, security updates, optimization, and troubleshooting services.',
      'website maintenance, technical support, website security updates, bug fixing',
      adminUserId,
      adminUserId
    ],
    [
      'Cloud and Infrastructure Solutions',
      'cloud-and-infrastructure-solutions',
      'Cloud hosting setup, server configuration, deployment support, and system monitoring for dependable infrastructure.',
      `
        <h2>Infrastructure support for dependable digital systems</h2>
        <p>Kuwexa helps businesses prepare production environments with hosting, deployment, and server support suited to long-term reliability.</p>
        <h3>Included services</h3>
        <ul>
          <li>Cloud Hosting Setup</li>
          <li>Server Configuration</li>
          <li>Deployment Support</li>
          <li>System Monitoring</li>
        </ul>
      `,
      'Cloud',
      'Cloud and Infrastructure Solutions | Kuwexa',
      'Cloud hosting, deployment, server configuration, and monitoring services for modern platforms.',
      'cloud hosting setup, server configuration, deployment support, system monitoring',
      adminUserId,
      adminUserId
    ],
    [
      'Business Digital Solutions',
      'business-digital-solutions',
      'Google Business Profile setup, digital presence management, business optimization, and process automation for service businesses.',
      `
        <h2>Digital tools for day-to-day business visibility</h2>
        <p>Kuwexa supports businesses with practical digital solutions that improve local presence, discoverability, and repetitive operational handling.</p>
        <h3>Included services</h3>
        <ul>
          <li>Google Business Profile Setup</li>
          <li>Google Business Optimization</li>
          <li>Digital Presence Management</li>
          <li>Business Process Automation</li>
        </ul>
      `,
      'Business Ops',
      'Business Digital Solutions | Kuwexa',
      'Google Business optimization, digital presence management, and business process automation services.',
      'google business profile setup, google business optimization, digital presence management, business process automation',
      adminUserId,
      adminUserId
    ],
    [
      'Technology Collaboration Services',
      'technology-collaboration-services',
      'Outsourced development support, startup tech support, agency partnerships, and project-based collaboration for delivery teams.',
      `
        <h2>Flexible technical collaboration for growing teams</h2>
        <p>Kuwexa works with startups, agencies, and businesses that need dependable development capacity, project-based support, or long-term delivery partnership.</p>
        <h3>Included services</h3>
        <ul>
          <li>Development Outsourcing</li>
          <li>Project Based Development Support</li>
          <li>Startup Tech Support</li>
          <li>Agency Development Partnerships</li>
        </ul>
      `,
      'Partnerships',
      'Technology Collaboration Services | Kuwexa',
      'Development outsourcing, startup tech support, and agency development partnership services.',
      'development outsourcing, startup tech support, agency development partnerships, project based development support',
      adminUserId,
      adminUserId
    ]
  ];

  for (const service of services) {
    await upsertService(connection, service);
  }

  const products = [
    [
      'LeadPilot CRM',
      'leadpilot-crm',
      'A sales-ready lead capture and pipeline platform for growing service businesses.',
      `
        <p>LeadPilot CRM helps businesses capture website inquiries, qualify leads, assign ownership, and track every conversation from first contact to close.</p>
        <p>It combines a clean manager-facing pipeline with conversion-focused public forms and dashboard reporting.</p>
      `,
      JSON.stringify(['Lead intake pipeline', 'Manager assignment', 'Activity timeline', 'Performance reporting']),
      JSON.stringify(['Node.js', 'Express', 'MySQL', 'Tailwind CSS']),
      null,
      JSON.stringify([]),
      'https://demo.kuwexa.com/leadpilot',
      'https://www.kuwexa.com',
      'published',
      'LeadPilot CRM | Kuwexa Platform',
      'LeadPilot CRM is a lead capture and pipeline platform for growing service businesses.',
      'lead crm, sales pipeline software, service business crm',
      adminUserId,
      adminUserId
    ],
    [
      'OpsDesk Flow',
      'opsdesk-flow',
      'A workflow control panel for projects, hiring, and internal operational visibility.',
      `
        <p>OpsDesk Flow centralizes projects, internal tasks, candidate workflows, and delivery reporting in one admin interface.</p>
        <p>It is built for teams that have outgrown spreadsheets and disconnected tools.</p>
      `,
      JSON.stringify(['Project visibility', 'Hiring workflow', 'Role-based access', 'Analytics dashboard']),
      JSON.stringify(['Express', 'RBAC', 'EJS', 'MySQL']),
      null,
      JSON.stringify([]),
      'https://demo.kuwexa.com/opsdesk',
      'https://www.kuwexa.com',
      'published',
      'OpsDesk Flow | Kuwexa Platform',
      'OpsDesk Flow helps teams manage projects, hiring, and operations from one dashboard.',
      'operations dashboard, workflow software, team management platform',
      adminUserId,
      adminUserId
    ]
  ];

  for (const product of products) {
    await upsertProduct(connection, product);
  }

  function composeProjectRichText({ paragraphs = [], items = [] }) {
    const blocks = [
      ...paragraphs.map((paragraph) => `        <p>${paragraph}</p>`),
      ...(items.length
        ? ['        <ul>', ...items.map((item) => `          <li>${item}</li>`), '        </ul>']
        : [])
    ];

    return `
${blocks.join('\n')}
      `;
  }

  function liveSiteLink(url) {
    return `<a href="https://${url}" target="_blank" rel="noreferrer">${url}</a>`;
  }

  function createProjectSeed({
    title,
    slug,
    shortDescription,
    client,
    clientIndustry,
    technologies,
    category,
    descriptionParagraphs,
    problemParagraphs,
    solutionParagraphs,
    resultParagraphs = [],
    resultItems = [],
    metaDescription,
    metaKeywords
  }) {
    return [
      title,
      slug,
      shortDescription,
      composeProjectRichText({ paragraphs: descriptionParagraphs }),
      client,
      clientIndustry,
      JSON.stringify(technologies),
      category,
      composeProjectRichText({ paragraphs: problemParagraphs }),
      composeProjectRichText({ paragraphs: solutionParagraphs }),
      composeProjectRichText({ paragraphs: resultParagraphs, items: resultItems }),
      'published',
      `${title} | Portfolio`,
      metaDescription,
      metaKeywords,
      adminUserId,
      adminUserId
    ];
  }

  function buildClubProject({
    title,
    slug,
    client,
    category = 'Club Website',
    clientIndustry = 'Gaming Club Platform',
    shortDescription
  }) {
    return createProjectSeed({
      title,
      slug,
      shortDescription:
        shortDescription ||
        `A mobile-first ${category.toLowerCase()} for ${title} focused on clear onboarding, support access, and fast visitor action.`,
      client,
      clientIndustry,
      technologies: ['Responsive Landing Pages', 'Mobile-First UI', 'Action-Focused Sections', 'Content Updates'],
      category,
      descriptionParagraphs: [
        `${title} at ${liveSiteLink(client)} was structured as a focused ${category.toLowerCase()} designed to move visitors quickly toward platform access, updates, or support guidance.`,
        'The build emphasized bold presentation, clear section hierarchy, and fast scanning for users arriving primarily from mobile devices.'
      ],
      problemParagraphs: [
        'The website needed to communicate the platform clearly without clutter, while keeping key calls to action and help content easy to find on smaller screens.'
      ],
      solutionParagraphs: [
        'Kuwexa simplified the information flow with scannable content blocks, stronger hero messaging, and reusable sections for instructions, promotions, and contact touchpoints.',
        'The final structure keeps the experience lightweight for visitors and practical for future content updates.'
      ],
      resultItems: [
        'Cleaner first-screen communication for mobile traffic',
        'Faster routes to sign-up, app access, or support information',
        'Reusable landing-page sections for ongoing updates'
      ],
      metaDescription: `${title} case study by Kuwexa for a mobile-first ${category.toLowerCase()} at ${client}.`,
      metaKeywords: `${slug.replace(/-/g, ' ')}, ${category.toLowerCase()}, kuwexa initiative`
    });
  }

  const projects = [
    createProjectSeed({
      title: 'Kuwexa Company Website',
      slug: 'kuwexa-company-platform',
      shortDescription:
        'A company website and operations-ready web platform for Kuwexa, built to present services clearly and manage content in-house.',
      client: 'www.kuwexa.com',
      clientIndustry: 'Technology Services',
      technologies: ['Node.js', 'Express', 'MySQL', 'Tailwind CSS', 'Dashboard CMS'],
      category: 'Company Website',
      descriptionParagraphs: [
        `The Kuwexa website at ${liveSiteLink('www.kuwexa.com')} was built as the company's public-facing service platform, balancing positioning, lead capture, initiatives, and internal manageability.`,
        'The delivery combined branded frontend presentation with CMS-driven updates so the team can manage services, products, portfolio work, blog content, and hiring pages from one connected system.'
      ],
      problemParagraphs: [
        'The business needed a website that looked credible to new prospects while also giving the internal team dependable control over content, inquiries, and growth pages.'
      ],
      solutionParagraphs: [
        'Kuwexa delivered a modular Express and MySQL platform with reusable page sections, role-aware administration, SEO controls, and content modules for public and internal workflows.',
        'The site structure was shaped around business clarity first, then backed by tools that make day-to-day updates practical.'
      ],
      resultItems: [
        'Clearer service positioning for new prospects',
        'Portfolio, blog, and hiring content managed from one system',
        'Consistent public brand presentation backed by internal workflow control'
      ],
      metaDescription:
        'Kuwexa company website case study covering brand presentation, content control, and operational website management.',
      metaKeywords: 'kuwexa website project, company website case study, kuwexa initiative'
    }),
    createProjectSeed({
      title: 'Woollyes Ecommerce Website',
      slug: 'woollyes-ecommerce-website',
      shortDescription:
        'An ecommerce storefront for Woollyes focused on product trust, cleaner shopping flow, and mobile-first merchandising.',
      client: 'www.woollyes.com',
      clientIndustry: 'Ecommerce / Consumer Goods',
      technologies: ['Responsive Storefront', 'Product Pages', 'Merchandising Sections', 'SEO Content Structure'],
      category: 'Ecommerce Website',
      descriptionParagraphs: [
        `Woollyes at ${liveSiteLink('www.woollyes.com')} is a product-led ecommerce website centered on wool dryer balls and a cleaner consumer shopping experience.`,
        'The project emphasized stronger product storytelling, clearer benefit-led sections, and a storefront structure that stays easy to update as new collections or promotions are introduced.'
      ],
      problemParagraphs: [
        'The website needed to communicate product benefits quickly, reduce friction between the landing experience and catalog browsing, and keep trust signals visible on mobile devices.'
      ],
      solutionParagraphs: [
        'Kuwexa shaped the experience around simplified collection browsing, product-first calls to action, and reusable content blocks for benefits, reviews, and FAQs.',
        'The visual structure keeps purchase intent moving while supporting merchandising changes without a redesign.'
      ],
      resultItems: [
        'Sharper product messaging on key landing sections',
        'Easier browsing across featured collections and purchase paths',
        'A storefront structure ready for ongoing merchandising updates'
      ],
      metaDescription:
        'Woollyes ecommerce website case study covering product storytelling, mobile shopping flow, and storefront structure.',
      metaKeywords: 'woollyes website project, ecommerce storefront case study, kuwexa initiative'
    }),
    createProjectSeed({
      title: 'Woollyfelt Ecommerce Website',
      slug: 'woollyfelt-ecommerce-website',
      shortDescription:
        'A handcrafted-product ecommerce website for Woollyfelt with cleaner catalog presentation and stronger mobile shopping flow.',
      client: 'www.woollyfelt.com',
      clientIndustry: 'Ecommerce / Handmade Goods',
      technologies: ['Responsive Storefront', 'Product Catalog', 'Collection Pages', 'Content Merchandising'],
      category: 'Ecommerce Website',
      descriptionParagraphs: [
        `Woollyfelt at ${liveSiteLink('www.woollyfelt.com')} showcases custom wool products through a warm, product-first ecommerce experience.`,
        'The work focused on making collections easier to scan, strengthening product presentation, and giving the brand a storefront that feels curated rather than crowded.'
      ],
      problemParagraphs: [
        'The storefront needed better visual hierarchy so shoppers could understand the range of handmade products quickly and move toward product detail pages with less hesitation.'
      ],
      solutionParagraphs: [
        'Kuwexa reorganized the browsing flow around featured collections, cleaner product presentation, and landing sections that support seasonal or category-led merchandising.',
        'The updated structure keeps the storefront flexible while preserving a more polished handcrafted brand feel.'
      ],
      resultItems: [
        'Cleaner collection discovery for shoppers',
        'Stronger product presentation on smaller screens',
        'An ecommerce layout that supports future catalog growth'
      ],
      metaDescription:
        'Woollyfelt ecommerce website case study covering collection structure, product presentation, and mobile shopping improvements.',
      metaKeywords: 'woollyfelt website project, handmade ecommerce case study, kuwexa initiative'
    }),
    createProjectSeed({
      title: 'Noble Infosystems Company Website',
      slug: 'noble-infosystems-company-website',
      shortDescription:
        'A corporate website for Noble Infosystems designed to present digital services with clearer structure, trust cues, and inquiry paths.',
      client: 'www.nobleinfosystems.com',
      clientIndustry: 'IT Services',
      technologies: ['Responsive UI', 'Service Pages', 'Inquiry Flow', 'SEO-Ready Structure'],
      category: 'Company Website',
      descriptionParagraphs: [
        `Noble Infosystems at ${liveSiteLink('www.nobleinfosystems.com')} presents technology and digital business services through a streamlined corporate website experience.`,
        'The project was shaped around clearer service hierarchy, stronger credibility signals, and page structure that helps visitors understand the offer without digging through clutter.'
      ],
      problemParagraphs: [
        'The business needed a more structured public website that could communicate its service scope clearly while making consultation or inquiry paths easier to find.'
      ],
      solutionParagraphs: [
        'Kuwexa organized the website around direct service messaging, cleaner navigation, and supporting sections for proof, delivery approach, and lead capture.',
        'The result is a company website that reads more clearly for prospective clients and remains easier to maintain internally.'
      ],
      resultItems: [
        'Sharper communication of services and digital capabilities',
        'Cleaner inquiry paths for prospective clients',
        'A more credible corporate presentation across the site'
      ],
      metaDescription:
        'Noble Infosystems company website case study covering service structure, credibility, and lead-focused presentation.',
      metaKeywords: 'noble infosystems website project, corporate website case study, kuwexa initiative'
    }),
    createProjectSeed({
      title: 'Kriticraft Nepal Ecommerce Website',
      slug: 'kriticraft-nepal-ecommerce-website',
      shortDescription:
        'A craft-focused ecommerce website for Kriticraft Nepal built around product discovery, brand warmth, and a cleaner shopping journey.',
      client: 'www.kriticraftnepal.com',
      clientIndustry: 'Ecommerce / Handmade Crafts',
      technologies: ['Responsive Storefront', 'Product Discovery', 'Category Pages', 'Brand Storytelling'],
      category: 'Ecommerce Website',
      descriptionParagraphs: [
        `Kriticraft Nepal at ${liveSiteLink('www.kriticraftnepal.com')} showcases handmade felt and craft products through a warm, brand-led storefront experience.`,
        'The project focused on balancing product browsing with storytelling so the catalog feels approachable, crafted, and easy to navigate across desktop and mobile.'
      ],
      problemParagraphs: [
        'The brand needed a website that could present handcrafted products attractively while still keeping shopping, category browsing, and content updates straightforward.'
      ],
      solutionParagraphs: [
        'Kuwexa structured the site around cleaner category flow, stronger product sections, and a visual rhythm that supports both shopping intent and brand personality.',
        'The resulting storefront stays practical for updates while giving the product range a more polished digital presentation.'
      ],
      resultItems: [
        'Improved product discovery across the catalog',
        'A warmer and more distinctive digital brand presentation',
        'Cleaner category structure for ongoing storefront updates'
      ],
      metaDescription:
        'Kriticraft Nepal ecommerce website case study covering handcrafted product discovery, brand storytelling, and storefront structure.',
      metaKeywords: 'kriticraft nepal website project, craft ecommerce case study, kuwexa initiative'
    }),
    buildClubProject({
      title: 'Topup Game Vault Website',
      slug: 'topup-game-vault-website',
      client: 'topupgamevault.com',
      category: 'Top-up Website',
      clientIndustry: 'Gaming Credit Platform',
      shortDescription:
        'A top-up focused website for Topup Game Vault built around direct action, support visibility, and mobile-first navigation.'
    }),
    buildClubProject({
      title: 'Juwa Slots Website',
      slug: 'juwa-slots-website',
      client: 'juwaslots.com',
      category: 'Slots Website',
      shortDescription:
        'A mobile-first slots website for Juwa Slots focused on simple access, clear instructions, and faster visitor action.'
    }),
    buildClubProject({
      title: 'Sirius Slots Website',
      slug: 'sirius-slots-website',
      client: 'sirius-slots.com',
      category: 'Slots Website',
      shortDescription:
        'A streamlined slots website for Sirius Slots with stronger onboarding flow, clearer support sections, and mobile-ready presentation.'
    }),
    buildClubProject({
      title: 'River Sweeps Club Website',
      slug: 'river-sweeps-club-website',
      client: 'riversweepsclub.com',
      category: 'Sweepstakes Website',
      clientIndustry: 'Sweepstakes Club Platform',
      shortDescription:
        'A sweepstakes club website for River Sweeps Club designed around mobile readability, support access, and direct navigation.'
    }),
    buildClubProject({
      title: 'Mega Spin Club Website',
      slug: 'mega-spin-club-website',
      client: 'megaspinclub.com',
      category: 'Club Website',
      shortDescription:
        'A bold club website for Mega Spin Club focused on clearer landing structure, fast scanning, and cleaner calls to action.'
    }),
    buildClubProject({
      title: 'Ultra Panda Club Website',
      slug: 'ultra-panda-club-website',
      client: 'ultrapandaclub.com',
      category: 'Club Website',
      shortDescription:
        'A mobile-first club website for Ultra Panda Club built to keep platform messaging simple, readable, and action-oriented.'
    }),
    buildClubProject({
      title: 'Panda Master Club Website',
      slug: 'panda-master-club-website',
      client: 'pandamasterclub.com',
      category: 'Club Website',
      shortDescription:
        'A focused club website for Panda Master Club with cleaner onboarding sections, stronger hero messaging, and easy update paths.'
    }),
    buildClubProject({
      title: 'VBlink Club Website',
      slug: 'vblink-club-website',
      client: 'vblinkclub.com',
      category: 'Club Website',
      shortDescription:
        'A compact club website for VBlink Club shaped around mobile-first visibility, scannable content, and direct support access.'
    }),
    buildClubProject({
      title: 'Vegas Sweeps Club Website',
      slug: 'vegas-sweeps-club-website',
      client: 'vegassweepsclub.com',
      category: 'Sweepstakes Website',
      clientIndustry: 'Sweepstakes Club Platform',
      shortDescription:
        'A sweepstakes-style website for Vegas Sweeps Club built around fast access, simple navigation, and cleaner mobile presentation.'
    }),
    buildClubProject({
      title: 'Orion Stars Club Website',
      slug: 'orion-stars-club-website',
      client: 'orionstarsclub.com',
      category: 'Club Website',
      shortDescription:
        'A club website for Orion Stars Club designed to make updates, support information, and visitor actions easier to follow.'
    }),
    buildClubProject({
      title: 'Game Vault Club Website',
      slug: 'game-vault-club-website',
      client: 'game-vaultclub.com',
      category: 'Club Website',
      shortDescription:
        'A landing-focused club website for Game Vault Club with clearer platform communication and a stronger mobile-first flow.'
    }),
    buildClubProject({
      title: 'Fire Kirin Club Website',
      slug: 'fire-kirin-club-website',
      client: 'firekirinclub.com',
      category: 'Club Website',
      shortDescription:
        'A direct-response club website for Fire Kirin Club with bold presentation, clear support paths, and reusable landing sections.'
    }),
    buildClubProject({
      title: 'Juwa Club Website',
      slug: 'juwa-club-website',
      client: 'juwaclub.com',
      category: 'Club Website',
      shortDescription:
        'A mobile-first club website for Juwa Club focused on simplified visitor journeys and easy-to-update support content.'
    }),
    buildClubProject({
      title: 'Milky Way Online App Website',
      slug: 'milky-way-online-app-website',
      client: 'milkywayonlineapp.com',
      category: 'App Website',
      clientIndustry: 'Online App Platform',
      shortDescription:
        'An app-focused landing website for Milky Way Online App built around quick onboarding, platform clarity, and mobile-first flow.'
    }),
    createProjectSeed({
      title: 'Service Brand SEO Engine',
      slug: 'service-brand-seo-engine',
      shortDescription:
        'An SEO-focused website rebuild for a service brand needing structured editorial operations.',
      client: 'B2B Services Client',
      clientIndustry: 'B2B Services',
      technologies: ['Tailwind CSS', 'Express', 'Schema Markup', 'Blog CMS'],
      category: 'SEO System',
      descriptionParagraphs: [
        'An SEO-focused web rebuild for a services company that needed better category pages, structured editorial workflow, and cleaner metadata control.',
        'The project introduced search-ready templates, editorial operations, and a more persuasive service architecture.'
      ],
      problemParagraphs: [
        'The previous site lacked scalable page structure, publishing workflow clarity, and practical control over metadata and search templates.'
      ],
      solutionParagraphs: [
        'The rebuilt platform introduced search-ready templates, blog workflow support, stronger service architecture, and dashboard-based SEO control.'
      ],
      resultItems: [
        'Faster publishing operations for internal teams',
        'Improved service-page structure and topical coverage',
        'Metadata and sitemap control without developer intervention'
      ],
      metaDescription:
        'SEO-led website architecture and publishing workflow system for a B2B services brand.',
      metaKeywords: 'seo project, editorial system case study, service website rebuild'
    }),
    createProjectSeed({
      title: 'Operations Dashboard Modernization',
      slug: 'operations-dashboard-modernization',
      shortDescription:
        'A workflow modernization project for a distributed team managing leads, projects, and hiring.',
      client: 'Remote Ops Team',
      clientIndustry: 'Operations',
      technologies: ['Express', 'MySQL', 'RBAC', 'Dashboard UI'],
      category: 'Operations',
      descriptionParagraphs: [
        'A workflow modernization project for a remote team handling leads, projects, and hiring activity through disconnected manual processes.',
        'Kuwexa replaced fragmented tracking with role-based views, clean status handling, and operational reporting.'
      ],
      problemParagraphs: [
        'Multiple workflows were being tracked manually across inboxes and spreadsheets, which made ownership and reporting unreliable.'
      ],
      solutionParagraphs: [
        'The solution created clear admin and manager views, status-driven workflows, and a single reporting layer for operational activity.'
      ],
      resultItems: [
        'Reduced ambiguity in lead and hiring ownership',
        'Centralized operational records across teams',
        'Cleaner dashboard visibility for management workflows'
      ],
      metaDescription:
        'Role-based operations dashboard and workflow design for a distributed team.',
      metaKeywords: 'operations dashboard project, workflow modernization, role based system'
    })
  ];

  for (const project of projects) {
    await upsertProject(connection, project);
  }

  const publishedAt = new Date();
  const posts = [
    [
      'What High-Intent Service Websites Get Right',
      'what-high-intent-service-websites-get-right',
      'A look at how service websites should handle positioning, proof, and conversion flow.',
      `
        <h2>Most service websites confuse browsing with selling</h2>
        <p>Pages often explain what a company does without helping the buyer understand why it matters now, what makes the team credible, or what the next step should be.</p>
        <h3>What works better</h3>
        <ul>
          <li>Clear buyer-specific messaging</li>
          <li>Proof in the form of results and case studies</li>
          <li>Page structure that moves toward inquiry</li>
        </ul>
      `,
      adminUserId,
      'Website Strategy',
      JSON.stringify(['conversion', 'positioning', 'service websites']),
      'What High-Intent Service Websites Get Right | Kuwexa',
      'How to structure service websites for clarity, trust, and conversion.',
      'service websites, conversion pages, positioning',
      'published',
      publishedAt
    ],
    [
      'Why SEO CMS Design Is an Operations Problem',
      'why-seo-cms-design-is-an-operations-problem',
      'SEO breaks when publishing workflows are clumsy. Here is how to design the system properly.',
      `
        <h2>Publishing friction destroys consistency</h2>
        <p>Teams do not fail at SEO because they forget title tags. They fail because the content system is awkward, approvals are unclear, and updates take too long.</p>
        <p>A better CMS is operational infrastructure, not just a writing interface.</p>
      `,
      adminUserId,
      'SEO Operations',
      JSON.stringify(['seo', 'cms', 'content operations']),
      'Why SEO CMS Design Is an Operations Problem | Kuwexa',
      'SEO performance depends on publishing workflow design more than most teams realize.',
      'seo cms, content operations, publishing workflow',
      'published',
      publishedAt
    ],
    [
      'Role-Based Dashboards for Small Teams',
      'role-based-dashboards-for-small-teams',
      'Small teams need permissions and workflow boundaries too, especially as operations scale.',
      `
        <h2>Access control is not just an enterprise concern</h2>
        <p>When every user can change everything, the system becomes fragile. A clean admin and manager split keeps operations moving while protecting critical settings.</p>
        <p>RBAC also makes the interface easier to use because each role sees less noise.</p>
      `,
      adminUserId,
      'Operations',
      JSON.stringify(['rbac', 'dashboard', 'small team systems']),
      'Role-Based Dashboards for Small Teams | Kuwexa',
      'Why smaller delivery teams benefit from role-based access and cleaner operational views.',
      'rbac dashboard, small team systems, admin manager roles',
      'published',
      publishedAt
    ]
  ];

  for (const post of posts) {
    await upsertPost(connection, post);
  }

  await connection.query(
    `
      DELETE FROM team_members
      WHERE slug IN (
        'aarav-singh',
        'mia-carter',
        'priya-menon',
        'jordan-hale',
        'govind-jha',
        'kundan-kumar',
        'ravi-kumar',
        'ravi-raj'
      )
    `
  );

  const teamMembers = [
    [
      'Govind Jha',
      'govind-jha',
      'leadership',
      'Chief Executive Officer',
      'Executive Office',
      'Leads the vision, delivery direction, and long-term business growth strategy for Kuwexa Private Limited.',
      `
        <p>Govind Jha leads Kuwexa Private Limited as Chief Executive Officer and Co-Founder, guiding the company’s commerce, technology, and growth direction.</p>
        <p>His focus is on building dependable digital systems that help businesses operate more efficiently and scale with confidence.</p>
      `,
      'hello@kuwexa.com',
      '+91 90000 00001',
      null,
      'https://www.linkedin.com/in/govind-jha',
      'https://x.com/govindjha',
      'https://www.facebook.com/govindjha',
      'Govind Jha | CEO and Co-Founder | Kuwexa',
      'Govind Jha is the Chief Executive Officer and Co-Founder of Kuwexa Private Limited.',
      'Govind Jha, Kuwexa CEO, leadership profile',
      'active',
      1
    ],
    [
      'Kundan Kumar',
      'kundan-kumar',
      'leadership',
      'Chief Operating Officer and Co-Founder',
      'Operations',
      'Oversees execution, internal coordination, and operational discipline across projects and support services.',
      `
        <p>Kundan Kumar serves as Chief Operating Officer, ensuring projects, team workflows, and delivery systems remain aligned with client needs.</p>
        <p>He helps turn strategy into practical execution, with a strong emphasis on stability, clarity, and process reliability.</p>
      `,
      'hello@kuwexa.com',
      '+91 90000 00002',
      null,
      'https://www.linkedin.com/in/kundan-kumar',
      null,
      'https://www.facebook.com/kundankumar',
      'Kundan Kumar | COO and Co-Founder | Kuwexa',
      'Kundan Kumar is the Chief Operating Officer and Co-Founder of Kuwexa Private Limited.',
      'Kundan Kumar, Kuwexa COO, operations leadership',
      'active',
      2
    ],
    [
      'Ravi Raj',
      'ravi-raj',
      'leadership',
      'Chief Financial Officer and Co-Founder',
      'Finance',
      'Provides financial oversight and supports scalable decision-making for sustainable business growth.',
      `
        <p>Ravi Raj serves as Chief Financial Officer and Co-Founder, helping Kuwexa maintain financial discipline while supporting long-term expansion.</p>
        <p>His leadership ensures the company’s growth plans remain grounded in dependable operational and commercial planning.</p>
      `,
      'hello@kuwexa.com',
      '+91 90000 00003',
      null,
      'https://www.linkedin.com/in/ravi-raj',
      null,
      'https://www.facebook.com/ravikumar',
      'Ravi Raj | CFO and Co-Founder | Kuwexa',
      'Ravi Raj is the Chief Financial Officer and Co-Founder of Kuwexa Private Limited.',
      'Ravi Raj, Kuwexa CFO, finance leadership',
      'active',
      3
    ]
  ];

  for (const member of teamMembers) {
    await upsertTeamMember(connection, member);
  }

  const jobs = [
    [
      'Frontend Engineer',
      'frontend-engineer',
      `
        <h2>Role overview</h2>
        <p>Build detailed marketing pages, dashboard interfaces, and reusable UI systems that support real business workflows.</p>
        <h3>What you will do</h3>
        <ul>
          <li>Ship responsive frontend experiences</li>
          <li>Collaborate on page architecture and interaction design</li>
          <li>Contribute to quality control and launch readiness</li>
        </ul>
      `,
      'Remote',
      'Full-time',
      'open',
      'Frontend Engineer | Careers at Kuwexa',
      'Join Kuwexa to build high-quality interfaces for websites, platforms, and operational products.',
      'frontend engineer, kuwexa jobs, ui engineer role'
    ],
    [
      'Content and SEO Manager',
      'content-and-seo-manager',
      `
        <h2>Role overview</h2>
        <p>Own editorial operations, search-ready page planning, and the content engine behind the Kuwexa platform.</p>
        <h3>What you will do</h3>
        <ul>
          <li>Manage publishing workflow inside the CMS</li>
          <li>Drive SEO structure and content refreshes</li>
          <li>Translate product delivery into persuasive case studies and articles</li>
        </ul>
      `,
      'Hybrid',
      'Full-time',
      'open',
      'Content and SEO Manager | Careers at Kuwexa',
      'Lead editorial workflow and search-focused content strategy at Kuwexa.',
      'seo manager, content manager job, kuwexa careers'
    ]
  ];

  for (const job of jobs) {
    await upsertJob(connection, job);
  }

  await connection.query(
    `
      INSERT INTO pages (
        title, slug, page_type, body, template, meta_title, meta_description, status, created_by, updated_by
      )
      VALUES (?, ?, 'page', ?, 'default', ?, ?, 'published', ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        body = VALUES(body),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        status = 'published',
        updated_by = VALUES(updated_by)
    `,
    [
      'About Kuwexa',
      'about-kuwexa',
      `
        <h2>Kuwexa builds scalable systems for global commerce.</h2>
        <p>The company connects trade enablement, digital commerce, and operational technology to help businesses grow with more structure and less friction.</p>
        <p>The goal is simple: replace scattered workflows and generic digital presence with a platform that is both credible externally and useful internally.</p>
      `,
      'About Kuwexa | Kuwexa Private Limited',
      'Learn how Kuwexa approaches commerce, websites, workflows, and growth systems.',
      adminUserId,
      adminUserId
    ]
  );

  const [jobRows] = await connection.query('SELECT id, slug FROM jobs');
  const jobIdMap = Object.fromEntries(jobRows.map((job) => [job.slug, job.id]));

  await connection.query("DELETE FROM leads WHERE email IN ('aarav@example.com', 'mia@example.com')");
  await connection.query(
    `
      INSERT INTO leads (name, email, phone, message, status, source, notes)
      VALUES
        ('Aarav Singh', 'aarav@example.com', '+91 9000000001', 'Need a new website with lead management and analytics.', 'new', 'Website Contact Form', 'Requested fast turnaround.'),
        ('Mia Carter', 'mia@example.com', '+1 202 555 0111', 'Looking for SEO CMS and blog workflow support.', 'qualified', 'Referral', 'Interested in retainer model.')
    `
  );

  await connection.query("DELETE FROM applications WHERE email IN ('jordan@example.com', 'priya@example.com')");
  await connection.query(
    `
      INSERT INTO applications (job_id, name, email, phone, resume, cover_letter, status)
      VALUES
        (?, 'Jordan Hale', 'jordan@example.com', '+1 202 555 0122', '/uploads/resumes/sample-jordan.txt', 'Interested in shipping design systems and marketing pages.', 'reviewed'),
        (?, 'Priya Menon', 'priya@example.com', '+91 9000000002', '/uploads/resumes/sample-priya.txt', 'Experience across editorial operations and SEO systems.', 'new')
    `,
    [jobIdMap['frontend-engineer'], jobIdMap['content-and-seo-manager']]
  );

  await connection.query("DELETE FROM chat_inquiries WHERE email IN ('chatdemo@kuwexa.com')");
  await connection.query(
    `
      INSERT INTO chat_inquiries (
        name, email, phone, topic, message, page_path, status, manager_notes, manager_user_id, notified_at
      )
      VALUES
        ('Chat Demo User', 'chatdemo@kuwexa.com', '+91 90000 10000', 'Digital Platform Build', 'Need a company website, dashboard, and SEO setup. Looking for a manager callback.', '/', 'new', 'Seeded sample chat inquiry.', ?, NOW())
    `,
    [managerUserId]
  );

  const [visitorCountRows] = await connection.query('SELECT COUNT(*) AS total FROM visitor_logs');
  if (!visitorCountRows[0].total) {
    await connection.query(
      `
        INSERT INTO visitor_logs (path, ip_address, user_agent, referrer, visited_at)
        VALUES
          ('/', '127.0.0.1', 'seed-agent', 'direct', NOW() - INTERVAL 6 DAY),
          ('/', '127.0.0.1', 'seed-agent', 'direct', NOW() - INTERVAL 5 DAY),
          ('/services', '127.0.0.1', 'seed-agent', 'direct', NOW() - INTERVAL 4 DAY),
          ('/portfolio', '127.0.0.1', 'seed-agent', 'direct', NOW() - INTERVAL 3 DAY),
          ('/blog', '127.0.0.1', 'seed-agent', 'direct', NOW() - INTERVAL 2 DAY),
          ('/contact', '127.0.0.1', 'seed-agent', 'direct', NOW() - INTERVAL 1 DAY),
          ('/careers', '127.0.0.1', 'seed-agent', 'direct', NOW())
      `
    );
  }

  console.log('Database seeded successfully.');
  console.log('Default accounts:');
  console.log('  admin@kuwexa.com / ChangeMe123!');
  console.log('  manager@kuwexa.com / ChangeMe123!');
  console.log('  editor@kuwexa.com / ChangeMe123!');
  console.log('Sample public content, leads, applications, and chat inquiries were also seeded.');

  await connection.end();
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
