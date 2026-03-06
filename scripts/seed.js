require('dotenv').config();

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const { ensureTeamMemberColumns } = require('../backend/services/schemaMaintenanceService');

const permissions = {
  super_admin: [
    'dashboard.view',
    'users.manage',
    'settings.manage',
    'pages.manage',
    'services.manage',
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
  await connection.query(
    `
      INSERT INTO services (
        title, slug, short_description, description, icon, meta_title, meta_description, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        short_description = VALUES(short_description),
        description = VALUES(description),
        icon = VALUES(icon),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        updated_by = VALUES(updated_by)
    `,
    payload
  );
}

async function upsertProject(connection, payload) {
  await connection.query(
    `
      INSERT INTO projects (
        title, slug, description, client, technologies, category, results, status,
        meta_title, meta_description, created_by, updated_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        client = VALUES(client),
        technologies = VALUES(technologies),
        category = VALUES(category),
        results = VALUES(results),
        status = VALUES(status),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
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
        status, published_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        excerpt = VALUES(excerpt),
        content = VALUES(content),
        author_id = VALUES(author_id),
        category = VALUES(category),
        tags = VALUES(tags),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
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
        email, phone, image, linkedin_url, twitter_url, facebook_url, status, sort_order
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        title, slug, description, location, employment_type, status, meta_title, meta_description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        location = VALUES(location),
        employment_type = VALUES(employment_type),
        status = VALUES(status),
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description)
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
  await connection.query(schema);
  await ensureTeamMemberColumns(connection, DB_NAME);

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
    ['Super Admin', 'admin@codexwebz.com', defaultPassword, roleMap.super_admin],
    ['Manager', 'manager@codexwebz.com', defaultPassword, roleMap.manager],
    ['Editor', 'editor@codexwebz.com', defaultPassword, roleMap.editor]
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
  const adminUserId = userMap['admin@codexwebz.com'];
  const managerUserId = userMap['manager@codexwebz.com'];

  await connection.query(
    `
      UPDATE website_settings
      SET chat_manager_user_id = ?
      WHERE id = 1
    `,
    [managerUserId]
  );

  const services = [
    [
      'Web Platform Engineering',
      'web-platform-engineering',
      'Custom company websites, CMS workflows, dashboards, and API architecture built as one system.',
      `
        <h2>End-to-end platform delivery</h2>
        <p>CodexWebz designs and implements public websites, operational dashboards, REST APIs, and CMS structures that work together instead of sitting in separate tools.</p>
        <h3>Typical scope</h3>
        <ul>
          <li>Positioning-led website architecture</li>
          <li>Admin and manager dashboards</li>
          <li>Lead, blog, portfolio, and careers modules</li>
          <li>Deployment setup with Nginx, PM2, and Docker</li>
        </ul>
      `,
      'Platform Build',
      'Web Platform Engineering | CodexWebz',
      'Build a conversion-focused company website and operations platform with CodexWebz.',
      adminUserId,
      adminUserId
    ],
    [
      'SEO and Editorial Systems',
      'seo-editorial-systems',
      'Search-ready landing pages, metadata control, schema, blog CMS, and publishing workflow support.',
      `
        <h2>SEO built into the system</h2>
        <p>The platform treats search visibility as part of product design. Metadata, schema, URL control, and content workflows are managed from the same backend.</p>
        <h3>What this includes</h3>
        <ul>
          <li>Structured SEO settings</li>
          <li>Blog CMS with categories and tags</li>
          <li>OpenGraph and canonical support</li>
          <li>XML sitemap and robots automation</li>
        </ul>
      `,
      'SEO System',
      'SEO and Editorial Systems | CodexWebz',
      'Operational SEO systems for teams that need publishing speed and search readiness.',
      adminUserId,
      adminUserId
    ],
    [
      'Lead and Workflow Automation',
      'lead-workflow-automation',
      'Lead routing, hiring pipeline tracking, dashboards, alerts, and clean internal workflow management.',
      `
        <h2>Operational clarity without extra tools</h2>
        <p>Leads and applications should not disappear into inboxes or spreadsheets. CodexWebz builds tracked pipelines with clear statuses, ownership, and visibility.</p>
        <h3>Workflow modules</h3>
        <ul>
          <li>Lead intake and status progression</li>
          <li>Career applications and resume handling</li>
          <li>Email alert hooks</li>
          <li>Traffic and activity reporting</li>
        </ul>
      `,
      'Ops Flow',
      'Lead and Workflow Automation | CodexWebz',
      'Replace manual marketing and hiring handoffs with a cleaner operational system.',
      adminUserId,
      adminUserId
    ],
    [
      'Content-Led Growth Pages',
      'content-led-growth-pages',
      'Landing pages, service pages, case studies, and blog templates designed to support both trust and acquisition.',
      `
        <h2>Pages with a job to do</h2>
        <p>Each page is designed around buying questions, proof, and next-step movement. The result is a site that looks sharp and behaves like a sales asset.</p>
        <h3>Content surfaces</h3>
        <ul>
          <li>Service landing pages</li>
          <li>Case-study and portfolio templates</li>
          <li>Thought-leadership blog structures</li>
          <li>High-intent contact journeys</li>
        </ul>
      `,
      'Growth Pages',
      'Content-Led Growth Pages | CodexWebz',
      'Professional landing pages designed for credibility, discovery, and conversion.',
      adminUserId,
      adminUserId
    ]
  ];

  for (const service of services) {
    await upsertService(connection, service);
  }

  const projects = [
    [
      'CodexWebz Company Platform',
      'codexwebz-company-platform',
      `
        <p>A full company website and management platform for a service brand that needed public credibility and internal workflow control in one build.</p>
        <p>The solution combined a polished frontend, modular CMS, role-based dashboards, lead flow, hiring workflow, and deployment-ready infrastructure.</p>
      `,
      'CodexWebz Internal',
      JSON.stringify(['Node.js', 'Express', 'MySQL', 'Tailwind CSS', 'JWT']),
      'Web Platform',
      `
        <ul>
          <li>Unified public website and internal operations interface</li>
          <li>Lead and candidate workflow visibility from a single dashboard</li>
          <li>SEO configuration and analytics readiness built in</li>
        </ul>
      `,
      'published',
      'CodexWebz Company Platform | Portfolio',
      'A full-stack company website and dashboard system for delivery, content, and operations.',
      adminUserId,
      adminUserId
    ],
    [
      'Service Brand SEO Engine',
      'service-brand-seo-engine',
      `
        <p>An SEO-focused web rebuild for a services company that needed better category pages, structured editorial workflow, and cleaner metadata control.</p>
        <p>The project introduced search-ready templates, editorial operations, and a more persuasive service architecture.</p>
      `,
      'B2B Services Client',
      JSON.stringify(['Tailwind CSS', 'Express', 'Schema Markup', 'Blog CMS']),
      'SEO System',
      `
        <ul>
          <li>Faster publishing operations for internal teams</li>
          <li>Improved service-page structure and topical coverage</li>
          <li>Metadata and sitemap control without developer intervention</li>
        </ul>
      `,
      'published',
      'Service Brand SEO Engine | Portfolio',
      'SEO-led website architecture and publishing workflow system for a B2B services brand.',
      adminUserId,
      adminUserId
    ],
    [
      'Operations Dashboard Modernization',
      'operations-dashboard-modernization',
      `
        <p>A workflow modernization project for a remote team handling leads, projects, and hiring activity through disconnected manual processes.</p>
        <p>CodexWebz replaced fragmented tracking with role-based views, clean status handling, and operational reporting.</p>
      `,
      'Remote Ops Team',
      JSON.stringify(['Express', 'MySQL', 'RBAC', 'Dashboard UI']),
      'Operations',
      `
        <ul>
          <li>Reduced ambiguity in lead and hiring ownership</li>
          <li>Centralized operational records across teams</li>
          <li>Cleaner dashboard visibility for management workflows</li>
        </ul>
      `,
      'published',
      'Operations Dashboard Modernization | Portfolio',
      'Role-based operations dashboard and workflow design for a distributed team.',
      adminUserId,
      adminUserId
    ]
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
      'What High-Intent Service Websites Get Right | CodexWebz',
      'How to structure service websites for clarity, trust, and conversion.',
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
      'Why SEO CMS Design Is an Operations Problem | CodexWebz',
      'SEO performance depends on publishing workflow design more than most teams realize.',
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
      'Role-Based Dashboards for Small Teams | CodexWebz',
      'Why smaller delivery teams benefit from role-based access and cleaner operational views.',
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
        'ravi-kumar'
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
      'Leads the vision, delivery direction, and long-term business growth strategy for CodexWEBZ.',
      `
        <p>Govind Jha leads CodexWEBZ as Chief Executive Officer, guiding the company’s technology vision, strategic growth, and service direction.</p>
        <p>His focus is on building dependable digital systems that help businesses operate more efficiently and scale with confidence.</p>
      `,
      'info@codexwebz.com',
      '+91 90000 00001',
      null,
      'https://www.linkedin.com/in/govind-jha',
      'https://x.com/govindjha',
      'https://www.facebook.com/govindjha',
      'active',
      1
    ],
    [
      'Kundan Kumar',
      'kundan-kumar',
      'leadership',
      'Chief Operating Officer',
      'Operations',
      'Oversees execution, internal coordination, and operational discipline across projects and support services.',
      `
        <p>Kundan Kumar serves as Chief Operating Officer, ensuring projects, team workflows, and delivery systems remain aligned with client needs.</p>
        <p>He helps turn strategy into practical execution, with a strong emphasis on stability, clarity, and process reliability.</p>
      `,
      'info@codexwebz.com',
      '+91 90000 00002',
      null,
      'https://www.linkedin.com/in/kundan-kumar',
      null,
      'https://www.facebook.com/kundankumar',
      'active',
      2
    ],
    [
      'Ravi Kumar',
      'ravi-kumar',
      'leadership',
      'Chief Financial Officer',
      'Finance',
      'Provides financial oversight and supports scalable decision-making for sustainable business growth.',
      `
        <p>Ravi Kumar serves as Chief Financial Officer, helping CodexWEBZ maintain financial discipline while supporting long-term expansion.</p>
        <p>His leadership ensures the company’s growth plans remain grounded in dependable operational and commercial planning.</p>
      `,
      'info@codexwebz.com',
      '+91 90000 00003',
      null,
      'https://www.linkedin.com/in/ravi-kumar',
      null,
      'https://www.facebook.com/ravikumar',
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
      'Frontend Engineer | Careers at CodexWebz',
      'Join CodexWebz to build high-quality interfaces for websites and operational products.'
    ],
    [
      'Content and SEO Manager',
      'content-and-seo-manager',
      `
        <h2>Role overview</h2>
        <p>Own editorial operations, search-ready page planning, and the content engine behind the CodexWebz platform.</p>
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
      'Content and SEO Manager | Careers at CodexWebz',
      'Lead editorial workflow and search-focused content strategy at CodexWebz.'
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
      'About CodexWebz',
      'about-codexwebz',
      `
        <h2>CodexWebz builds digital systems with a bias toward execution.</h2>
        <p>The company focuses on websites, dashboards, SEO systems, and operational tooling that help small and mid-sized teams move faster with less friction.</p>
        <p>The goal is simple: replace scattered tools and vague marketing pages with a platform that is both credible externally and useful internally.</p>
      `,
      'About CodexWebz | CodexWebz',
      'Learn how CodexWebz approaches websites, workflows, and growth systems.',
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

  await connection.query("DELETE FROM chat_inquiries WHERE email IN ('chatdemo@codexwebz.com')");
  await connection.query(
    `
      INSERT INTO chat_inquiries (
        name, email, phone, topic, message, page_path, status, manager_notes, manager_user_id, notified_at
      )
      VALUES
        ('Chat Demo User', 'chatdemo@codexwebz.com', '+91 90000 10000', 'Website Development', 'Need a company website, dashboard, and SEO setup. Looking for a manager callback.', '/', 'new', 'Seeded sample chat inquiry.', ?, NOW())
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
  console.log('  admin@codexwebz.com / ChangeMe123!');
  console.log('  manager@codexwebz.com / ChangeMe123!');
  console.log('  editor@codexwebz.com / ChangeMe123!');
  console.log('Sample public content, leads, applications, and chat inquiries were also seeded.');

  await connection.end();
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
