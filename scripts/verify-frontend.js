const path = require('path');
const ejs = require('ejs');
const app = require('../backend/app');
const content = require('../backend/services/siteContentService');

void app;

const root = path.join(__dirname, '..');

const sampleService = {
  title: 'Web Platform Engineering',
  slug: 'web-platform-engineering',
  short_description: 'Custom company websites, dashboards, and CMS workflows.',
  description: '<p>Sample service body.</p>',
  icon: 'Platform Build',
  profile: content.resolveServiceProfile({ slug: 'web-platform-engineering', title: 'Web Platform Engineering' })
};

const sampleProject = {
  title: 'CodexWebz Company Platform',
  slug: 'codexwebz-company-platform',
  category: 'Web Platform',
  client: 'CodexWebz Internal',
  description: '<p>Sample project description.</p>',
  results: '<ul><li>Improved workflow visibility</li></ul>',
  technologies: ['Node.js', 'Express', 'MySQL'],
  images: [],
  summary: 'Sample project summary.'
};

const samplePost = {
  title: 'What High-Intent Service Websites Get Right',
  slug: 'what-high-intent-service-websites-get-right',
  category: 'Website Strategy',
  excerpt: 'Sample excerpt',
  summary: 'Sample excerpt',
  content: '<p>Sample blog body.</p>',
  tags: ['seo', 'conversion'],
  author_name: 'CodexWebz',
  created_at: new Date(),
  published_at: new Date()
};

const sampleJob = {
  title: 'Frontend Engineer',
  slug: 'frontend-engineer',
  location: 'Remote',
  employment_type: 'Full-time',
  status: 'open',
  description: '<p>Sample job description.</p>'
};

const sampleTeamShowcase = {
  leadership: [
    {
      name: 'Govind Jha',
      slug: 'govind-jha',
      member_type: 'leadership',
      designation: 'Chief Executive Officer',
      department: 'Executive Office',
      short_bio: 'Leads the vision, delivery direction, and long-term business growth strategy for CodexWEBZ.',
      bio: '<p>Sample leadership bio.</p>',
      email: 'info@codexwebz.com',
      linkedin_url: 'https://www.linkedin.com/in/govind-jha',
      twitter_url: 'https://x.com/govindjha',
      facebook_url: 'https://www.facebook.com/govindjha',
      image: null
    },
    {
      name: 'Kundan Kumar',
      slug: 'kundan-kumar',
      member_type: 'leadership',
      designation: 'Chief Operating Officer',
      department: 'Operations',
      short_bio: 'Oversees execution, internal coordination, and operational discipline across projects and support services.',
      bio: '<p>Sample leadership bio.</p>',
      email: 'info@codexwebz.com',
      linkedin_url: 'https://www.linkedin.com/in/kundan-kumar',
      twitter_url: null,
      facebook_url: null,
      image: null
    },
    {
      name: 'Ravi Kumar',
      slug: 'ravi-kumar',
      member_type: 'leadership',
      designation: 'Chief Financial Officer',
      department: 'Finance',
      short_bio: 'Provides financial oversight and supports scalable decision-making for sustainable business growth.',
      bio: '<p>Sample leadership bio.</p>',
      email: 'info@codexwebz.com',
      linkedin_url: 'https://www.linkedin.com/in/ravi-kumar',
      twitter_url: null,
      facebook_url: 'https://www.facebook.com/ravikumar',
      image: null
    }
  ],
  employees: []
};

const shared = {
  title: 'Test',
  seo: { metaTitle: 'Test', metaDescription: 'Test description', canonicalUrl: '/' },
  siteSettings: {
    company_name: 'CodexWebz',
    company_email: 'hello@codexwebz.com',
    company_phone: '+91 00000 00000',
    address: 'Remote-first',
    hero_subtitle: 'Sample subtitle',
    primary_color: '#00240a',
    secondary_color: '#dbab0d'
  },
  currentPath: '/',
  currentYear: 2026,
  appUrl: 'http://localhost:4000',
  currentUser: null,
  csrfToken: 'token',
  teamShowcase: sampleTeamShowcase
};

const dashboardShared = {
  ...shared,
  currentUser: {
    id: 1,
    name: 'Admin User',
    email: 'admin@codexwebz.com',
    role_name: 'super_admin',
    permissions: [
      'dashboard.view',
      'users.manage',
      'settings.manage',
      'pages.manage',
      'services.manage',
      'portfolio.manage',
      'team.manage',
      'blog.manage',
      'leads.manage',
      'careers.manage',
      'seo.manage',
      'analytics.view'
    ]
  },
  areaLabel: 'Admin',
  basePath: '/admin',
  menu: [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Users', href: '/admin/users' }
  ],
  activeMenu: 'Dashboard',
  pageTitle: 'Dashboard',
  notice: null,
  helpers: {
    formatDate(value) {
      return value ? new Date(value).toLocaleDateString('en-US') : '';
    },
    titleCase(value) {
      return String(value || '');
    }
  }
};

const pages = [
  ['frontend/pages/home.ejs', { ...shared, services: [sampleService], projects: [sampleProject], posts: [samplePost], jobs: [sampleJob], marketing: content.getHomeContent({ services: [sampleService], projects: [sampleProject], posts: [samplePost], jobs: [sampleJob] }) }],
  ['frontend/pages/about.ejs', { ...shared, currentPath: '/about-us', title: 'About CodexWEBZ', pageContent: content.getAboutPageContent() }],
  ['frontend/pages/team.ejs', { ...shared, currentPath: '/team', title: 'Team', pageContent: content.getTeamPageContent(sampleTeamShowcase) }],
  ['frontend/pages/team-detail.ejs', { ...shared, currentPath: '/team/govind-jha', title: 'Govind Jha', member: sampleTeamShowcase.leadership[0] }],
  ['frontend/pages/services.ejs', { ...shared, currentPath: '/services', services: [sampleService], pageContent: content.getServicesPageContent([sampleService]) }],
  ['frontend/pages/service-detail.ejs', { ...shared, currentPath: '/services/web-platform-engineering', service: sampleService, profile: sampleService.profile }],
  ['frontend/pages/portfolio.ejs', { ...shared, currentPath: '/portfolio', projects: [sampleProject], pageContent: content.getPortfolioPageContent([sampleProject]) }],
  ['frontend/pages/project-detail.ejs', { ...shared, currentPath: '/portfolio/codexwebz-company-platform', project: sampleProject }],
  ['frontend/pages/blog.ejs', { ...shared, currentPath: '/blog', posts: [samplePost], pageContent: content.getBlogPageContent([samplePost]) }],
  ['frontend/pages/blog-detail.ejs', { ...shared, currentPath: '/blog/what-high-intent-service-websites-get-right', post: samplePost }],
  ['frontend/pages/careers.ejs', { ...shared, currentPath: '/careers', jobs: [sampleJob], pageContent: content.getCareersPageContent([sampleJob]) }],
  ['frontend/pages/job-detail.ejs', { ...shared, currentPath: '/careers/frontend-engineer', job: sampleJob, applied: null, pageContent: content.getCareersPageContent([sampleJob]) }],
  ['frontend/pages/contact.ejs', { ...shared, currentPath: '/contact', sent: null, pageContent: content.getContactPageContent() }],
  ['frontend/pages/login.ejs', { ...shared, currentPath: '/login', error: null }],
  ['frontend/pages/page.ejs', { ...shared, currentPath: '/about-codexwebz', page: { title: 'About CodexWebz', body: '<p>Sample page body.</p>' } }],
  ['frontend/pages/error.ejs', { ...shared, title: 'Error', message: 'Sample error message.' }],
  ['dashboard/components/module-page.ejs', {
    ...dashboardShared,
    activeMenu: 'Users',
    pageTitle: 'User Management',
    form: {
      title: 'Create User',
      action: '/admin/users',
      submitLabel: 'Create User',
      fields: [
        { name: 'name', label: 'Name', type: 'text', value: '' }
      ]
    },
    table: {
      title: 'Users',
      description: 'System users',
      columns: [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' }
      ],
      rows: [
        { name: 'Admin User', email: 'admin@codexwebz.com' }
      ],
      rowActions(row) {
        return `<span>${row.name}</span>`;
      }
    }
  }],
  ['dashboard/components/module-page.ejs', {
    ...dashboardShared,
    activeMenu: 'Team',
    pageTitle: 'Team Management',
    form: {
      title: 'Add Team Member',
      action: '/admin/team',
      submitLabel: 'Create Profile',
      enctype: 'multipart/form-data',
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', value: '' },
        { name: 'designation', label: 'Designation', type: 'text', value: '' },
        { name: 'short_bio', label: 'Short Bio', type: 'textarea', value: 'Short bio.' },
        { name: 'bio', label: 'Detailed Bio', type: 'richtext', value: '<p>Detailed bio.</p>' },
        { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url', value: 'https://www.linkedin.com/in/govind-jha' },
        { name: 'facebook_url', label: 'Facebook URL', type: 'url', value: 'https://www.facebook.com/govindjha' },
        { name: 'image', label: 'Profile Image', type: 'file', previewUrl: '/uploads/images/profile.png' }
      ]
    },
    table: {
      title: 'Team Directory',
      description: 'Public website team profiles',
      columns: [
        { label: 'Name', key: 'name' },
        { label: 'Designation', key: 'designation' }
      ],
      rows: [
        { name: 'Govind Jha', designation: 'Chief Executive Officer' }
      ],
      rowActions(row) {
        return `<span>${row.name}</span>`;
      }
    }
  }],
  ['dashboard/components/module-page.ejs', {
    ...dashboardShared,
    activeMenu: 'Chats',
    pageTitle: 'Chat Inbox',
    table: {
      title: 'Chat Inquiries',
      description: 'Website chat messages',
      columns: [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Topic', key: 'topic' }
      ],
      rows: [
        { name: 'Chat Demo User', email: 'chatdemo@codexwebz.com', topic: 'Website Development' }
      ],
      rowActions(row) {
        return `<span>${row.name}</span>`;
      }
    }
  }],
  ['dashboard/components/module-page.ejs', {
    ...dashboardShared,
    activeMenu: 'Leads',
    pageTitle: 'Lead Management',
    infoPanel: {
      title: 'Lead Intake',
      body: 'Leads are captured from the website.'
    },
    table: {
      title: 'Leads',
      description: 'Tracked inquiries',
      columns: [
        { label: 'Name', key: 'name' },
        { label: 'Date', key: 'created_at', type: 'date' }
      ],
      rows: [
        { name: 'Aarav Singh', created_at: new Date() }
      ],
      rowActions() {
        return '<span>Save</span>';
      }
    }
  }],
  ['dashboard/components/dashboard-home.ejs', {
    ...dashboardShared,
    cards: [
      { label: 'Visitors', value: 7 }
    ],
    latestLeads: [
      { name: 'Aarav Singh', email: 'aarav@example.com', status: 'new' }
    ],
    latestApplications: [
      { name: 'Jordan Hale', job_title: 'Frontend Engineer', status: 'reviewed' }
    ],
    featuredProjects: [
      { title: 'CodexWebz Company Platform', client: 'CodexWebz Internal', category: 'Web Platform' }
    ],
    latestPosts: [
      { title: 'Role-Based Dashboards for Small Teams', category: 'Operations', status: 'published' }
    ],
    trafficSeries: [
      { day: new Date(), visits: 5 }
    ]
  }],
  ['dashboard/components/analytics-page.ejs', {
    ...dashboardShared,
    activeMenu: 'Analytics',
    pageTitle: 'Analytics',
    overview: {
      visitors: 7,
      leads: 2,
      applications: 2
    },
    trafficSeries: [
      { day: new Date(), visits: 5 }
    ],
    topPages: [
      { path: '/', visits: 3 }
    ]
  }]
];

async function verify() {
  for (const [file, data] of pages) {
    await ejs.renderFile(path.join(root, file), data, { async: true });
  }

  console.log('Frontend verification passed.');
}

verify().catch((error) => {
  console.error(error);
  process.exit(1);
});
