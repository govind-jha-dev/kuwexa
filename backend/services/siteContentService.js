function stripHtml(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerpt(value, length = 170) {
  const plain = stripHtml(value);
  if (plain.length <= length) {
    return plain;
  }

  return `${plain.slice(0, length).trim()}...`;
}

const serviceProfiles = [
  {
    key: 'web-platform',
    matches: ['web', 'website', 'platform', 'development', 'app'],
    category: 'Platform Engineering',
    kicker: 'Build digital infrastructure that sells and scales.',
    deliverables: [
      'Conversion-focused marketing website',
      'Admin and manager dashboards',
      'REST API and CMS foundations',
      'Deployment architecture and observability'
    ],
    outcomes: [
      'Shorter content publishing cycles',
      'Cleaner lead handoff between marketing and ops',
      'A single platform instead of fragmented tools'
    ],
    process: [
      'Discovery and conversion mapping',
      'UI system and page architecture',
      'Backend workflow implementation',
      'Launch, analytics, and iteration'
    ]
  },
  {
    key: 'seo-content',
    matches: ['seo', 'content', 'search', 'blog'],
    category: 'SEO and Editorial Systems',
    kicker: 'Turn content operations into a repeatable acquisition channel.',
    deliverables: [
      'SEO page architecture and metadata',
      'Editorial workflow and publishing cadence',
      'Schema, sitemap, and search-console readiness',
      'Content measurement loop with analytics'
    ],
    outcomes: [
      'Faster article production and publishing',
      'Structured organic traffic growth',
      'Pages built with search intent from day one'
    ],
    process: [
      'Topic map and content architecture',
      'Template design and CMS setup',
      'On-page SEO implementation',
      'Measurement, refreshes, and scaling'
    ]
  },
  {
    key: 'automation-ops',
    matches: ['automation', 'crm', 'dashboard', 'lead', 'system'],
    category: 'Automation and Operations',
    kicker: 'Replace manual handoffs with tracked workflows and ownership.',
    deliverables: [
      'Lead status pipelines and assignment rules',
      'Career application workflows',
      'Operational dashboards and reporting',
      'Notification and alert automation'
    ],
    outcomes: [
      'Clear ownership across leads and hiring',
      'Lower operational drag from repetitive tasks',
      'Visibility into work that used to stay in inboxes'
    ],
    process: [
      'Workflow mapping',
      'RBAC and operational model design',
      'Automation rules and alerts',
      'Dashboard rollout and team training'
    ]
  }
];

const defaultServiceProfile = {
  category: 'Digital Delivery',
  kicker: 'Execution built around speed, clarity, and measurable output.',
  deliverables: [
    'Strategy translated into implementation',
    'Responsive user interface design',
    'Content and metadata support',
    'Launch-ready deployment handoff'
  ],
  outcomes: [
    'Cleaner buyer journeys',
    'More consistent delivery quality',
    'Systems that stay manageable post-launch'
  ],
  process: [
    'Scope alignment',
    'Design and structure',
    'Implementation and QA',
    'Launch and iteration'
  ]
};

function resolveServiceProfile(service = {}) {
  const haystack = `${service.slug || ''} ${service.title || ''}`.toLowerCase();
  const matched = serviceProfiles.find((profile) =>
    profile.matches.some((token) => haystack.includes(token))
  );

  return matched || defaultServiceProfile;
}

function getHomeContent({ services = [], products = [], projects = [], posts = [], jobs = [] }) {
  return {
    proofStats: [
      {
        value: `${Math.max(services.length, 4)}+`,
        label: 'Launch-ready service lines',
        copy: 'From website delivery to dashboards, content systems, and workflow automation.'
      },
      {
        value: `${Math.max(projects.length, 8)}+`,
        label: 'Structured build components',
        copy: 'Reusable modules across public website, CMS, careers, SEO, and operations.'
      },
      {
        value: `${Math.max(products.length, 2)}+`,
        label: 'Product-ready modules',
        copy: 'SaaS product showcase, detail pages, media galleries, and dashboard publishing control.'
      },
      {
        value: '72h',
        label: 'Average strategy turnaround',
        copy: 'CodexWebz focuses on fast clarity, not long discovery theatre.'
      }
    ],
    highlights: [
      {
        title: 'Public website that actually converts',
        copy: 'Messaging, page structure, SEO, and forms are treated as one acquisition system instead of separate tasks.'
      },
      {
        title: 'Role-based operational backend',
        copy: 'Admins control settings and users. Managers handle delivery, leads, content, and hiring without touching system-critical config.'
      },
      {
        title: 'Deployment-ready from day one',
        copy: 'Nginx, PM2, Docker, uploads, analytics, and sitemap support are already part of the architecture.'
      }
    ],
    workflow: [
      {
        step: '01',
        title: 'Position the offer',
        copy: 'Clarify what the company sells, who it sells to, and which pages need to move the buyer forward.'
      },
      {
        step: '02',
        title: 'Design the system',
        copy: 'Create a frontend language and backend workflows that fit the team instead of forcing generic admin tools.'
      },
      {
        step: '03',
        title: 'Ship the engine',
        copy: 'Build the public website, dashboards, CMS modules, automation hooks, and deployment assets as one product.'
      },
      {
        step: '04',
        title: 'Measure and refine',
        copy: 'Use analytics, lead flow, publishing cadence, and search visibility to tighten the system after launch.'
      }
    ],
    testimonials: [
      {
        quote: 'CodexWebz thinks in systems. The website, CMS, and operational workflows were designed as one machine.',
        name: 'Growth Lead',
        company: 'B2B Services Team'
      },
      {
        quote: 'The difference was speed with structure. Content, SEO, and lead routing started working together instead of fighting each other.',
        name: 'Founder',
        company: 'Services Startup'
      },
      {
        quote: 'We replaced spreadsheets and disconnected pages with a clean admin flow the team could actually use.',
        name: 'Operations Manager',
        company: 'Remote Delivery Team'
      }
    ],
    faqs: [
      {
        question: 'What does CodexWebz actually deliver?',
        answer: 'A public website, internal dashboards, CMS features, lead management, careers, SEO controls, and deployment-ready backend architecture.'
      },
      {
        question: 'Can managers operate the platform without developer support?',
        answer: 'Yes. The manager dashboard is intended for everyday content, lead, portfolio, and hiring workflows while system settings stay locked to admin roles.'
      },
      {
        question: 'Is the platform ready for production hosting?',
        answer: 'Yes. The project includes Docker, PM2, Nginx configuration, uploads handling, and environment-based configuration for VPS or cloud deployment.'
      }
    ],
    capabilityBands: [
      'Website Strategy',
      'Tailwind Frontend',
      'Express + MySQL',
      'SaaS Product Pages',
      'SEO CMS',
      'Lead Workflows',
      'Career Pipeline',
      'Analytics'
    ],
    jobsSummary: jobs.length ? `${jobs.length} open roles live in the careers engine.` : 'Career workflows are built in and ready once jobs are added.'
  };
}

function getServicesPageContent(services = []) {
  const categories = ['All', ...new Set(services.map((service) => resolveServiceProfile(service).category))];

  return {
    categories,
    engagementModels: [
      {
        title: 'Launch Sprint',
        copy: 'Ideal for teams that need a company website, CMS, and foundational analytics live fast.'
      },
      {
        title: 'Growth System',
        copy: 'Best for businesses that need SEO, blog workflows, portfolio proof, and lead capture aligned.'
      },
      {
        title: 'Ops Upgrade',
        copy: 'Focused on dashboards, roles, workflows, and operational clarity after the frontend goes live.'
      }
    ],
    faqs: [
      {
        question: 'Can each service page be updated by managers?',
        answer: 'Yes. Service content, descriptions, media, and metadata are editable from the role-based dashboard.'
      },
      {
        question: 'Are these one-off services or a connected system?',
        answer: 'They are designed to work together. The strongest results come from connecting acquisition, proof, content, and operations.'
      }
    ]
  };
}

function getProductsPageContent(products = []) {
  return {
    categories: ['All Products', ...new Set(products.map((product) => (product.status === 'published' ? 'Published' : 'Draft')))],
    values: [
      'Each product card links to a dedicated database-driven detail page.',
      'Features, tech stack, screenshots, and CTA links are manageable from the dashboard.',
      'The navigation can hide or show the entire product module from Website Settings.'
    ]
  };
}

function getProjectsPageContent(projects = []) {
  return {
    categories: ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))],
    values: [
      'Case studies emphasize business results, not just screenshots.',
      'Technology choices stay tied to workflow and growth requirements.',
      'Project records are manageable from the dashboard after launch.'
    ]
  };
}

function getBlogPageContent(posts = []) {
  return {
    categories: ['All', ...new Set(posts.map((post) => post.category).filter(Boolean))],
    editorialPrinciples: [
      'Write from implementation experience, not abstract trend-chasing.',
      'Connect SEO with actual publishing workflow, not checklists alone.',
      'Use CMS structure that managers can maintain without engineering help.'
    ]
  };
}

function getCareersPageContent(jobs = []) {
  return {
    locations: ['All', ...new Set(jobs.map((job) => job.location).filter(Boolean))],
    employmentTypes: ['All', ...new Set(jobs.map((job) => job.employment_type).filter(Boolean))],
    values: [
      {
        title: 'Own the outcome',
        copy: 'Work is measured by shipped systems and user impact, not performance theatre.'
      },
      {
        title: 'Prefer clarity over noise',
        copy: 'The team values direct communication, clean reasoning, and short feedback loops.'
      },
      {
        title: 'Build what matters',
        copy: 'Projects tie together product, marketing, operations, and engineering instead of living in silos.'
      }
    ],
    steps: [
      'Application review',
      'Role-fit conversation',
      'Practical evaluation',
      'Offer and onboarding'
    ],
    faqs: [
      {
        question: 'How are applications managed?',
        answer: 'Resumes, statuses, and candidate workflow all sit inside the management dashboard with role-based access.'
      },
      {
        question: 'Can managers review resumes without admin access?',
        answer: 'Yes. Careers and application handling are part of the manager permission set.'
      }
    ]
  };
}

function getContactPageContent() {
  return {
    promises: [
      'Clear response path for every inquiry',
      'Lead record created inside the dashboard',
      'Email alerts available for follow-up',
      'Project scoping aligned to real delivery constraints'
    ],
    engagementModels: [
      {
        title: 'Website Build',
        copy: 'New company site with positioning, pages, and conversion flow.'
      },
      {
        title: 'Growth System',
        copy: 'SEO CMS, content workflow, analytics, and lead capture tuned together.'
      },
      {
        title: 'Ops Platform',
        copy: 'Internal dashboard, workflows, permissions, and reporting for operational teams.'
      }
    ],
    faqs: [
      {
        question: 'What should be included in the inquiry?',
        answer: 'Describe the current bottleneck, target outcome, urgency, and any systems the new platform needs to replace or integrate with.'
      },
      {
        question: 'Does CodexWebz handle both frontend and backend?',
        answer: 'Yes. Design, frontend, backend, CMS, operations workflows, and deployment are treated as one delivery scope.'
      }
    ]
  };
}

function getAboutPageContent() {
  return {
    eyebrow: 'About CodexWEBZ',
    title: 'Technology systems built to support business growth, efficiency, and long-term scalability.',
    intro: 'CodexWEBZ is the technology services division of Kuwexa Private Limited, focused on helping businesses build reliable digital systems that support growth, efficiency, and long-term scalability.',
    summary: 'Businesses operating in a digital-first market need more than a basic website. They need structured platforms, strong online presence, practical automation, and dependable technical support that keeps the business moving.',
    highlights: [
      {
        title: 'Built for real operations',
        copy: 'CodexWEBZ designs systems that are practical for teams to use every day, not just impressive during launch week.'
      },
      {
        title: 'Technology aligned with business needs',
        copy: 'Being backed by Kuwexa Private Limited gives the team direct understanding of operational realities beyond pure engineering.'
      },
      {
        title: 'Reliable and scalable by design',
        copy: 'The priority is usability, performance, maintainability, and a platform structure that can grow with the business.'
      }
    ],
    narrative: [
      'At CodexWEBZ, we work with startups, small and medium enterprises, and growing organizations to turn business ideas into practical digital solutions.',
      'The focus is not on building complicated technology structures. The focus is on helping businesses strengthen their online presence, streamline operations, and reach customers more effectively through modern technology.',
      'Every solution is shaped to support dependable execution, long-term reliability, and measurable business value.'
    ],
    serviceGroups: [
      'Website Development',
      'Ecommerce Website Development',
      'Ecommerce Seller Account Setup (Amazon and Flipkart)',
      'Custom Software Development',
      'Business Web Applications',
      'SEO and Digital Marketing',
      'Google Business Listing and Optimization',
      'Cloud-Based Solutions',
      'Platform Integration and Technical Support'
    ],
    principles: [
      {
        title: 'Practical systems over unnecessary complexity',
        copy: 'Solutions are designed to be manageable, stable, and easy for businesses to operate after implementation.'
      },
      {
        title: 'Scalability without friction',
        copy: 'The platform architecture is meant to grow with customer acquisition, internal workflows, and new business requirements.'
      },
      {
        title: 'Support that stays dependable',
        copy: 'CodexWEBZ treats technical support and platform reliability as part of the product, not an afterthought.'
      }
    ],
    audience: [
      'Startups launching digital-first businesses',
      'SMEs improving customer reach and internal workflows',
      'Growing companies upgrading legacy websites or fragmented software tools'
    ],
    closing: 'At its core, CodexWEBZ believes technology should simplify business operations and enable sustainable growth. Whether a company is starting its digital journey or upgrading its existing systems, CodexWEBZ aims to be a trusted partner in building dependable digital platforms.'
  };
}

function getTeamPageContent(teamShowcase = { leadership: [], employees: [] }) {
  return {
    eyebrow: 'Team',
    title: 'Leadership, specialists, and delivery roles behind CodexWEBZ.',
    intro: 'CodexWEBZ is built by a leadership team focused on reliable digital systems and a delivery team that turns business needs into practical web, software, and growth solutions.',
    values: [
      {
        title: 'Business-aligned thinking',
        copy: 'The team works with a strong understanding of real business operations, not just isolated technical tasks.'
      },
      {
        title: 'Dependable execution',
        copy: 'Every profile here contributes to structured delivery, stable systems, and clear ownership.'
      },
      {
        title: 'Growth with usability',
        copy: 'The priority is always to build systems that remain scalable, manageable, and practical to use.'
      }
    ],
    metrics: [
      { label: 'Leadership Profiles', value: String(teamShowcase.leadership?.length || 0) },
      { label: 'Employee Profiles', value: String(teamShowcase.employees?.length || 0) },
      { label: 'Focused Mission', value: '1' }
    ]
  };
}

module.exports = {
  excerpt,
  stripHtml,
  resolveServiceProfile,
  getHomeContent,
  getServicesPageContent,
  getProductsPageContent,
  getProjectsPageContent,
  getPortfolioPageContent: getProjectsPageContent,
  getBlogPageContent,
  getCareersPageContent,
  getContactPageContent,
  getAboutPageContent,
  getTeamPageContent
};
