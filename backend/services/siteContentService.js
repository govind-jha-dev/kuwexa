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
    heroTitle: 'Technology solutions for modern businesses.',
    heroSubtitle: 'CodexWEBZ, the technology services division of Kuwexa Private Limited, helps businesses build reliable digital systems and scalable technology platforms that support growth, efficiency, and long-term business success.',
    proofStats: [
      {
        value: `${Math.max(services.length, 4)}+`,
        label: 'Core technology services',
        copy: 'Website development, web applications, ecommerce systems, SEO support, and long-term technical delivery.'
      },
      {
        value: `${Math.max(projects.length, 8)}+`,
        label: 'Scalable delivery modules',
        copy: 'Reusable frontend, backend, CMS, analytics, and workflow blocks for growing digital platforms.'
      },
      {
        value: `${Math.max(products.length, 2)}+`,
        label: 'Software showcase modules',
        copy: 'Product pages, screenshots, feature libraries, demo links, and dashboard-driven publishing control.'
      },
      {
        value: 'Ongoing',
        label: 'Support mindset',
        copy: 'CodexWEBZ focuses on reliable systems, continued improvement, and practical long-term support.'
      }
    ],
    highlights: [
      {
        title: 'Reliable digital systems',
        copy: 'CodexWEBZ helps businesses move beyond basic web presence into structured platforms that support operations and growth.'
      },
      {
        title: 'Business-aligned technology delivery',
        copy: 'Solutions are planned around real business goals so websites, applications, and support systems remain practical to use.'
      },
      {
        title: 'Scalable and support-ready',
        copy: 'The focus stays on performance, usability, maintainability, and the technical support needed after launch.'
      }
    ],
    workflow: [
      {
        step: '01',
        title: 'Understand business objectives',
        copy: 'Start with the company goal, operational challenge, and growth target so the solution fits real business needs.'
      },
      {
        step: '02',
        title: 'Design aligned technology',
        copy: 'Shape websites, applications, integrations, and workflows around the business instead of forcing generic tools.'
      },
      {
        step: '03',
        title: 'Build scalable platforms',
        copy: 'Develop digital systems that are structured, reliable, and ready to support current operations as well as future scale.'
      },
      {
        step: '04',
        title: 'Support and improve',
        copy: 'Continue with optimization, maintenance, and technical support so the platform keeps delivering value after launch.'
      }
    ],
    testimonials: [
      {
        quote: 'CodexWEBZ translated the business requirement into a structured digital system that the team could use confidently every day.',
        name: 'Operations Lead',
        company: 'Growing Business'
      },
      {
        quote: 'The delivery stayed practical from start to finish. We got a stronger digital presence and a platform that supported the business properly.',
        name: 'Founder',
        company: 'Startup Team'
      },
      {
        quote: 'What stood out was the balance of technical execution and business understanding. The system felt dependable from day one.',
        name: 'Business Manager',
        company: 'SME Client'
      }
    ],
    faqs: [
      {
        question: 'What does CodexWEBZ help businesses build?',
        answer: 'Professional websites, custom web applications, ecommerce systems, SEO-ready platforms, integrations, and dependable technical support.'
      },
      {
        question: 'Who does CodexWEBZ usually work with?',
        answer: 'Startups, enterprises, growing companies, agencies needing development support, and organizations building digital platforms.'
      },
      {
        question: 'Does CodexWEBZ support businesses after the initial build?',
        answer: 'Yes. Ongoing improvements, maintenance, support, and optimization are part of the long-term delivery mindset.'
      }
    ],
    capabilityBands: [
      'Website Development',
      'Custom Web Apps',
      'Ecommerce Platforms',
      'SEO and Marketing',
      'Mobile Apps',
      'Cloud Solutions',
      'Integrations',
      'Technical Support'
    ],
    jobsSummary: jobs.length ? `${jobs.length} open roles are available for the growing delivery team.` : 'Career workflows are ready whenever new technology and growth roles are published.'
  };
}

function getServicesPageContent(services = []) {
  const categories = ['All', ...new Set(services.map((service) => resolveServiceProfile(service).category))];

  return {
    categories,
    engagementModels: [
      {
        title: 'Website and Platform Launch',
        copy: 'Best for businesses that need a professional website, structured platform, and strong digital foundation.'
      },
      {
        title: 'Custom Software and Workflow Build',
        copy: 'Ideal for organizations that need web applications, internal workflows, or operational systems tailored to the business.'
      },
      {
        title: 'Support and Growth Partnership',
        copy: 'Ongoing maintenance, SEO support, platform improvements, and technical assistance for teams scaling digitally.'
      }
    ],
    serviceDepth: [
      {
        title: 'Business websites with structure',
        copy: 'CodexWEBZ builds responsive websites that combine presentation, performance, conversion clarity, and long-term manageability.'
      },
      {
        title: 'Custom systems for day-to-day operations',
        copy: 'Web applications, dashboards, and workflow tools are shaped around how the business actually functions.'
      },
      {
        title: 'Visibility and growth support',
        copy: 'SEO, content structure, analytics readiness, and digital marketing support help businesses strengthen online reach.'
      },
      {
        title: 'Reliable post-launch support',
        copy: 'Maintenance, optimization, and technical support keep digital systems stable and useful after launch.'
      }
    ],
    workflow: [
      {
        step: '01',
        title: 'Understand the requirement',
        copy: 'The engagement starts with the business objective, the operational challenge, and the expected outcome.'
      },
      {
        step: '02',
        title: 'Define the right delivery path',
        copy: 'The service scope is aligned to business priorities, platform needs, and the most practical implementation route.'
      },
      {
        step: '03',
        title: 'Build the working solution',
        copy: 'Frontend, backend, integrations, content structure, and workflow logic are delivered as one consistent system.'
      },
      {
        step: '04',
        title: 'Support long-term growth',
        copy: 'After launch, the system can continue improving through support, optimization, and additional delivery phases.'
      }
    ],
    audiences: [
      'Startups launching digital products or modern service brands',
      'SMEs improving digital presence and internal processes',
      'Ecommerce businesses building structured online sales systems',
      'Organizations replacing fragmented digital tools with dependable platforms'
    ],
    faqs: [
      {
        question: 'Can service content be updated after launch?',
        answer: 'Yes. Service pages, descriptions, media, and metadata remain editable from the role-based dashboard.'
      },
      {
        question: 'Are the services standalone or connected?',
        answer: 'They can be delivered individually or combined into a broader digital system that supports websites, software, visibility, and operations together.'
      }
    ]
  };
}

function getProductsPageContent(products = []) {
  return {
    categories: ['All Products', ...new Set(products.map((product) => (product.status === 'published' ? 'Published' : 'Draft')))],
    values: [
      'Each software product can be presented with overview, features, screenshots, technology stack, and demo links.',
      'Admin and manager roles can update product content, images, and publishing state directly from the dashboard.',
      'The products section can be shown or hidden from Website Settings when needed.'
    ]
  };
}

function getProjectsPageContent(projects = []) {
  return {
    categories: ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))],
    values: [
      'Each case study connects business objective, delivery approach, technology choices, and measurable outcome.',
      'Projects are presented as practical business solutions rather than visual mockups alone.',
      'All project records stay editable from the dashboard after launch.'
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
      'Clear discovery and response process for every inquiry',
      'Lead record created inside the dashboard for structured follow-up',
      'Business-focused scoping before implementation begins',
      'Delivery support aligned to practical timelines and requirements'
    ],
    engagementModels: [
      {
        title: 'Website and Digital Presence',
        copy: 'Professional website builds, ecommerce setups, and visibility-focused digital foundations.'
      },
      {
        title: 'Custom Software and Platforms',
        copy: 'Business web applications, workflow tools, integrations, and scalable digital systems.'
      },
      {
        title: 'Support and Growth Services',
        copy: 'SEO, optimization, maintenance, and technical support for businesses improving existing platforms.'
      }
    ],
    contactCards: [
      {
        title: 'Plan a new digital build',
        copy: 'Best for new websites, digital products, ecommerce setups, and software platforms.'
      },
      {
        title: 'Improve an existing system',
        copy: 'Useful when the current website or software platform needs stronger structure, performance, or usability.'
      },
      {
        title: 'Get ongoing technical support',
        copy: 'Ideal for companies that need maintenance, issue resolution, support, and continuous platform improvement.'
      }
    ],
    responseSteps: [
      {
        step: '01',
        title: 'Inquiry review',
        copy: 'The request is reviewed and added to the lead management workflow for structured follow-up.'
      },
      {
        step: '02',
        title: 'Requirement clarification',
        copy: 'The team aligns on business goals, current gaps, and the most practical direction for delivery.'
      },
      {
        step: '03',
        title: 'Recommended next step',
        copy: 'A suitable engagement path is outlined for discussion, scoping, implementation, or support.'
      }
    ],
    checklist: [
      'Your business objective or target outcome',
      'The current problem, gap, or platform issue',
      'Required integrations or systems involved',
      'Expected timeline or urgency',
      'Whether the need is a new build, upgrade, or support request'
    ],
    faqs: [
      {
        question: 'What should be included in the inquiry?',
        answer: 'Share the business goal, current challenge, required platform or service, timeline, and any systems that need to be integrated or improved.'
      },
      {
        question: 'Does CodexWEBZ handle both frontend and backend delivery?',
        answer: 'Yes. Websites, software interfaces, backend workflows, integrations, CMS, and deployment support can all be handled within one delivery scope.'
      }
    ]
  };
}

function getAboutPageContent() {
  return {
    eyebrow: 'About CodexWEBZ',
    title: 'Technology systems built to support business growth, efficiency, and long-term scalability.',
    intro: 'CodexWEBZ is a technology services brand under Kuwexa Private Limited, focused on helping businesses build reliable digital systems and scalable technology platforms.',
    overview: 'In today\'s competitive environment, businesses need more than online presence. They need structured digital platforms, efficient systems, and reliable technical support that strengthens operations and long-term growth.',
    summary: 'In today’s competitive environment, businesses need more than online presence. They need structured digital platforms, efficient systems, and reliable technical support that strengthens operations and long-term growth.',
    highlights: [
      {
        title: 'Built for real operations',
        copy: 'CodexWEBZ develops practical digital systems that businesses can operate, improve, and scale over time.'
      },
      {
        title: 'Technology aligned with business needs',
        copy: 'The work is shaped around real-world business objectives so technology remains useful beyond the build phase.'
      },
      {
        title: 'Reliable and scalable by design',
        copy: 'Usability, performance, maintainability, and scalability stay at the center of every platform decision.'
      }
    ],
    narrative: [
      'CodexWEBZ collaborates with startups, enterprises, and growing companies to transform ideas into functional digital solutions that align with real business needs.',
      'The approach focuses on practical and scalable technology services that help organizations improve operations, expand their reach, and strengthen their digital infrastructure.',
      'Through structured delivery and dependable support, each platform is built to remain useful, efficient, and adaptable as the business grows.'
    ],
    vision: 'Our vision is to become a trusted technology partner for businesses by helping organizations grow through reliable digital infrastructure, practical innovation, and scalable technology platforms. CodexWEBZ aims to support companies as they adapt to a digital-first environment with systems that improve efficiency, strengthen online presence, and remain dependable over the long term. The goal is not only to build digital solutions, but to help businesses create a stronger operational foundation that supports sustainable growth, better customer reach, and long-term technology readiness.',
    visionPoints: [
      'Enable businesses to grow through reliable digital infrastructure and scalable technology systems.',
      'Help organizations adapt to digital transformation with practical, efficient, and manageable solutions.',
      'Build long-term technology readiness so businesses can operate with greater confidence, stability, and reach.'
    ],
    mission: 'To help businesses build, optimize, and scale their digital ecosystem through dependable technology services, structured systems, and development support aligned to real operational needs.',
    focusAreas: [
      'Building reliable and scalable digital platforms',
      'Supporting businesses with structured technical systems',
      'Helping organizations adopt modern technology with clarity',
      'Delivering practical solutions aligned with business growth'
    ],
    serviceGroups: [
      'Website Development',
      'Custom Web Application Development',
      'Ecommerce Website Development',
      'Ecommerce Seller Account Setup (Amazon and Flipkart)',
      'Custom Software Development',
      'SEO and Digital Marketing',
      'Mobile App Development',
      'Cloud-Based Solutions',
      'Website Maintenance and Technical Support'
    ],
    principles: [
      {
        title: 'Practical systems over unnecessary complexity',
        copy: 'The focus stays on solutions that are manageable, stable, and aligned with everyday business operations.'
      },
      {
        title: 'Scalability without friction',
        copy: 'Platforms are designed to support digital transformation, future growth, and new operational requirements.'
      },
      {
        title: 'Support that stays dependable',
        copy: 'Maintenance, support, and ongoing optimization are treated as part of the service, not an afterthought.'
      }
    ],
    audience: [
      'Startups launching digital products and services',
      'Small and medium businesses expanding online',
      'Tech companies and agencies needing dependable development support',
      'Organizations building or upgrading digital platforms'
    ],
    approach: [
      {
        title: 'Understand business objectives',
        copy: 'Every engagement starts with the company context, the operational challenge, and the intended growth outcome.'
      },
      {
        title: 'Design the right technology structure',
        copy: 'Websites, applications, integrations, and workflows are planned around usability, clarity, and long-term maintainability.'
      },
      {
        title: 'Deliver scalable implementation',
        copy: 'The build phase focuses on reliable execution, stable systems, and digital platforms that can grow with the organization.'
      },
      {
        title: 'Support continuous improvement',
        copy: 'After launch, the platform can keep improving through maintenance, optimization, and ongoing technical support.'
      }
    ],
    advantages: [
      'Scalable and structured technology solutions',
      'Experienced development support across business platforms',
      'Flexible collaboration for projects and long-term partnerships',
      'Strong focus on practical systems and sustainable client success'
    ],
    closing: 'At its core, CodexWEBZ believes technology should empower businesses, simplify operations, and create opportunities for growth. Whether a company is launching a new platform or improving an existing system, CodexWEBZ aims to be a trusted technology partner.'
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
        copy: 'The team approaches delivery with a clear understanding of both technical execution and practical business needs.'
      },
      {
        title: 'Dependable execution',
        copy: 'Every profile contributes to structured delivery, stable systems, and reliable support across projects.'
      },
      {
        title: 'Growth with usability',
        copy: 'The goal is to build systems that remain scalable, manageable, and practical for businesses to operate long term.'
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
