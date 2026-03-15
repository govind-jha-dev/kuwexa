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

const serviceCatalog = [
  {
    title: 'Web Development Services',
    summary: 'Structured websites, custom web experiences, and scalable web applications for businesses that need more than a basic online presence.',
    items: [
      'Website Development',
      'Custom Website Design',
      'Business Website Development',
      'Corporate Website Development',
      'Landing Page Development',
      'Portfolio Website Development',
      'Web Application Development',
      'Custom Web Application Development',
      'Progressive Web Apps (PWA)'
    ]
  },
  {
    title: 'Ecommerce Solutions',
    summary: 'Commerce-ready websites, seller setup, store operations, and integrations that support online sales and marketplace visibility.',
    items: [
      'Ecommerce Website Development',
      'Ecommerce Platform Setup',
      'Online Store Development',
      'Product Catalog Management',
      'Payment Gateway Integration',
      'Ecommerce Seller Account Setup',
      'Amazon Seller Account Setup',
      'Flipkart Seller Account Setup',
      'Marketplace Integration'
    ]
  },
  {
    title: 'Software Development',
    summary: 'Business software systems, SaaS platforms, and internal tools designed around real operational requirements.',
    items: [
      'Custom Software Development',
      'Business Software Solutions',
      'CRM Development',
      'Internal Business Systems',
      'API Integration',
      'SaaS Platform Development'
    ]
  },
  {
    title: 'Mobile Application Development',
    summary: 'Mobile-first business applications for Android, iOS, and cross-platform delivery requirements.',
    items: [
      'Android App Development',
      'iOS App Development',
      'Cross Platform Mobile Apps',
      'Business Mobile Applications'
    ]
  },
  {
    title: 'Digital Marketing Services',
    summary: 'Search visibility and growth support that helps businesses attract traffic, leads, and stronger digital positioning.',
    items: [
      'Search Engine Optimization (SEO)',
      'Technical SEO',
      'Local SEO',
      'Digital Marketing Strategy',
      'Lead Generation Marketing'
    ]
  },
  {
    title: 'Social Media & Branding',
    summary: 'Brand presence and social media support for businesses building awareness, credibility, and stronger market visibility.',
    items: [
      'Social Media Marketing',
      'Social Media Management',
      'Brand Development',
      'Online Branding Strategy'
    ]
  },
  {
    title: 'Creative & Content Services',
    summary: 'Design and content support for businesses that need stronger creative assets, UI quality, and marketing communication.',
    items: [
      'Graphic Designing',
      'UI/UX Design',
      'Video Editing',
      'Content Writing',
      'Marketing Content Creation'
    ]
  },
  {
    title: 'Website Support & Maintenance',
    summary: 'Long-term support, technical maintenance, and optimization for businesses running active digital platforms.',
    items: [
      'Website Maintenance',
      'Technical Support',
      'Website Security Updates',
      'Website Performance Optimization',
      'Bug Fixing & Troubleshooting'
    ]
  },
  {
    title: 'Cloud & Infrastructure',
    summary: 'Hosting, deployment, server setup, and monitoring support for dependable production systems.',
    items: [
      'Cloud Hosting Setup',
      'Server Configuration',
      'Deployment Support',
      'System Monitoring'
    ]
  },
  {
    title: 'Business Digital Solutions',
    summary: 'Practical digital solutions that help businesses strengthen local presence and automate repeatable processes.',
    items: [
      'Google Business Profile Setup',
      'Google Business Optimization',
      'Digital Presence Management',
      'Business Process Automation'
    ]
  },
  {
    title: 'Technology Collaboration Services',
    summary: 'Flexible development collaboration for startups, agencies, and teams needing technical execution support.',
    items: [
      'Development Outsourcing',
      'Project Based Development Support',
      'Startup Tech Support',
      'Agency Development Partnerships'
    ]
  }
];

const marketingServices = [
  'Website Development',
  'Ecommerce Development',
  'Web Applications',
  'Mobile App Development',
  'Software Development',
  'SEO & Digital Marketing',
  'Social Media Marketing',
  'Graphic Design & Video Editing',
  'Website Maintenance & Support',
  'Google Business Optimization'
];

const serviceProfiles = [
  {
    key: 'web-development',
    matches: ['website', 'web development', 'web application', 'web app', 'landing page', 'portfolio website', 'corporate website', 'pwa', 'progressive web'],
    category: 'Web Development Services',
    kicker: 'Build business-ready websites and web platforms that stay practical after launch.',
    deliverables: [
      'Business and corporate websites',
      'Landing pages and portfolio websites',
      'Custom web applications and PWAs',
      'Responsive UI and CMS-ready delivery'
    ],
    outcomes: [
      'Stronger digital presence for the business',
      'Better usability across devices and teams',
      'A scalable web foundation for future growth'
    ],
    process: [
      'Requirement discovery and page mapping',
      'UI structure and technical planning',
      'Development, CMS setup, and QA',
      'Launch support and ongoing optimization'
    ]
  },
  {
    key: 'ecommerce-solutions',
    matches: ['ecommerce', 'seller', 'amazon', 'flipkart', 'marketplace', 'store', 'catalog', 'payment gateway'],
    category: 'Ecommerce Solutions',
    kicker: 'Launch and manage online sales systems with dependable storefront and marketplace support.',
    deliverables: [
      'Online store development and setup',
      'Marketplace and seller account integration',
      'Product catalog and payment gateway support',
      'Commerce flows designed for operational clarity'
    ],
    outcomes: [
      'Faster path from product listing to sale',
      'Better visibility across owned store and marketplaces',
      'Structured ecommerce operations teams can manage'
    ],
    process: [
      'Store planning and catalog structure',
      'Platform setup and payment integration',
      'Marketplace and seller workflow configuration',
      'Testing, launch, and support'
    ]
  },
  {
    key: 'software-development',
    matches: ['software', 'crm', 'saas', 'api', 'internal business', 'business software', 'system'],
    category: 'Software Development',
    kicker: 'Turn operational requirements into usable business software and SaaS-ready platforms.',
    deliverables: [
      'Custom software and internal business systems',
      'CRM and workflow-driven business tools',
      'API integrations and data connections',
      'SaaS platform architecture support'
    ],
    outcomes: [
      'More efficient internal operations',
      'Less dependency on disconnected third-party tools',
      'Systems shaped around real business processes'
    ],
    process: [
      'Business workflow mapping',
      'System architecture and module planning',
      'Feature delivery and integration',
      'Testing, rollout, and support'
    ]
  },
  {
    key: 'mobile-app-development',
    matches: ['mobile', 'android', 'ios', 'cross platform'],
    category: 'Mobile Application Development',
    kicker: 'Deliver mobile experiences that support customer journeys and business operations.',
    deliverables: [
      'Android and iOS application planning',
      'Cross-platform app development',
      'Business mobile workflow support',
      'API-connected mobile feature delivery'
    ],
    outcomes: [
      'Stronger mobile reach for business services',
      'Better accessibility for customers and teams',
      'Applications designed for long-term iteration'
    ],
    process: [
      'Mobile requirement analysis',
      'User flow and feature definition',
      'App development and API integration',
      'Testing, deployment, and improvement'
    ]
  },
  {
    key: 'digital-marketing-services',
    matches: ['seo', 'digital marketing', 'lead generation', 'technical seo', 'local seo', 'search engine optimization'],
    category: 'Digital Marketing Services',
    kicker: 'Strengthen visibility, search performance, and lead generation with structured digital marketing support.',
    deliverables: [
      'SEO audits and on-page optimization',
      'Technical SEO and local SEO implementation',
      'Lead-generation-focused marketing direction',
      'Search-ready metadata and content structure'
    ],
    outcomes: [
      'Improved discoverability across search channels',
      'Better alignment between content and business goals',
      'More qualified inbound opportunities over time'
    ],
    process: [
      'Visibility assessment and keyword planning',
      'Technical SEO and content structure updates',
      'Local and lead-generation optimization',
      'Measurement, reporting, and iteration'
    ]
  },
  {
    key: 'social-media-branding',
    matches: ['social media', 'branding', 'brand development', 'brand'],
    category: 'Social Media & Branding',
    kicker: 'Build a clearer public identity across social channels and brand touchpoints.',
    deliverables: [
      'Social media positioning and campaign support',
      'Brand development and messaging direction',
      'Online branding strategy',
      'Content-aligned social presentation'
    ],
    outcomes: [
      'More consistent brand communication',
      'Stronger trust across audience touchpoints',
      'Better continuity between website and social presence'
    ],
    process: [
      'Brand discovery and positioning',
      'Channel strategy and content direction',
      'Creative rollout and social management setup',
      'Performance review and improvement'
    ]
  },
  {
    key: 'creative-content-services',
    matches: ['graphic', 'ui/ux', 'video', 'content writing', 'marketing content', 'content'],
    category: 'Creative & Content Services',
    kicker: 'Support growth with stronger visuals, better interfaces, and clearer marketing content.',
    deliverables: [
      'Graphic design and UI/UX support',
      'Video editing and content asset creation',
      'Website and campaign content writing',
      'Marketing content structured for clarity and performance'
    ],
    outcomes: [
      'More polished digital presentation',
      'Clearer messaging across pages and campaigns',
      'Creative assets that support trust and engagement'
    ],
    process: [
      'Creative brief and content alignment',
      'Design exploration and asset production',
      'Review, refinement, and delivery',
      'Publishing support and rollout'
    ]
  },
  {
    key: 'website-support-maintenance',
    matches: ['maintenance', 'support', 'security', 'performance', 'bug', 'troubleshooting'],
    category: 'Website Support & Maintenance',
    kicker: 'Keep digital platforms stable, secure, and effective after the initial build is complete.',
    deliverables: [
      'Technical support and issue resolution',
      'Website maintenance and security updates',
      'Performance optimization work',
      'Bug fixing and troubleshooting'
    ],
    outcomes: [
      'Lower risk of platform downtime or degradation',
      'More dependable day-to-day operations',
      'Ongoing improvement without rebuilding from scratch'
    ],
    process: [
      'Platform review and issue identification',
      'Maintenance and optimization planning',
      'Implementation and validation',
      'Monitoring and support continuity'
    ]
  },
  {
    key: 'cloud-infrastructure',
    matches: ['cloud', 'hosting', 'server', 'deployment', 'monitoring', 'infrastructure'],
    category: 'Cloud & Infrastructure',
    kicker: 'Support production readiness with cleaner hosting, deployment, and server operations.',
    deliverables: [
      'Cloud hosting and environment setup',
      'Server configuration and deployment support',
      'System monitoring and technical oversight',
      'Infrastructure aligned to platform needs'
    ],
    outcomes: [
      'More stable production environments',
      'Faster deployment and operational visibility',
      'Infrastructure that supports future scale'
    ],
    process: [
      'Environment assessment',
      'Hosting and server configuration',
      'Deployment setup and verification',
      'Monitoring and support handoff'
    ]
  },
  {
    key: 'business-digital-solutions',
    matches: ['google business', 'business process automation', 'digital presence', 'profile setup', 'optimization'],
    category: 'Business Digital Solutions',
    kicker: 'Improve local presence and simplify repeatable operations through targeted digital business support.',
    deliverables: [
      'Google Business Profile setup and optimization',
      'Digital presence management support',
      'Business process automation planning',
      'Practical visibility improvements for service brands'
    ],
    outcomes: [
      'Stronger local discoverability and trust signals',
      'Cleaner operational handling of repeatable tasks',
      'Better alignment between online presence and business activity'
    ],
    process: [
      'Current presence and process review',
      'Optimization and automation planning',
      'Implementation across tools and listings',
      'Review and ongoing improvement'
    ]
  },
  {
    key: 'technology-collaboration-services',
    matches: ['outsourcing', 'startup tech', 'partnership', 'project based', 'agency', 'development support', 'collaboration'],
    category: 'Technology Collaboration Services',
    kicker: 'Extend delivery capacity with a reliable technical partner for projects, retainers, and startup growth.',
    deliverables: [
      'Project-based development support',
      'Startup technology execution assistance',
      'Agency delivery partnerships',
      'Flexible outsourced development collaboration'
    ],
    outcomes: [
      'More delivery capacity without unnecessary overhead',
      'Dependable technical execution for partner teams',
      'Collaboration models aligned to real project needs'
    ],
    process: [
      'Scope alignment and collaboration model selection',
      'Delivery planning and ownership mapping',
      'Execution and communication rhythm',
      'Review, support, and next-phase planning'
    ]
  }
];

const defaultServiceProfile = {
  category: 'Technology Services',
  kicker: 'Execution built around practical delivery, business clarity, and long-term reliability.',
  deliverables: [
    'Business-aligned planning and implementation',
    'Responsive frontend and structured backend workflows',
    'Content, metadata, and operational support',
    'Launch-ready delivery with room to scale'
  ],
  outcomes: [
    'Cleaner digital operations and customer journeys',
    'More dependable delivery quality',
    'Systems that remain manageable after launch'
  ],
  process: [
    'Discovery and scope alignment',
    'Solution design and structure',
    'Implementation and QA',
    'Launch, support, and iteration'
  ]
};

function normalizeProfileItems(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[\r\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return fallback;
}

function resolveServiceProfile(service = {}) {
  const haystack = `${service.slug || ''} ${service.title || ''}`.toLowerCase();
  const matched = serviceProfiles.find((profile) =>
    profile.matches.some((token) => haystack.includes(token))
  );
  const baseProfile = matched || defaultServiceProfile;

  return {
    ...baseProfile,
    category: service.category || baseProfile.category,
    kicker: service.kicker || baseProfile.kicker,
    deliverables: normalizeProfileItems(service.deliverables, baseProfile.deliverables),
    outcomes: normalizeProfileItems(service.outcomes, baseProfile.outcomes),
    process: normalizeProfileItems(service.process, baseProfile.process)
  };
}

function getHomeContent({ services = [], products = [], projects = [], posts = [], jobs = [] }) {
  return {
    heroTitle: 'Technology solutions for modern businesses.',
    heroSubtitle: 'CodexWEBZ helps businesses build reliable digital systems and scalable technology platforms that support growth, efficiency, and long-term stability.',
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
    capabilityBands: marketingServices,
    jobsSummary: jobs.length ? `${jobs.length} open roles are available for the growing delivery team.` : 'Career workflows are ready whenever new technology and growth roles are published.'
  };
}

function getServicesPageContent(services = []) {
  const categories = ['All', ...new Set(services.map((service) => resolveServiceProfile(service).category))];

  return {
    categories,
    marketingServices,
    serviceCatalog,
    engagementModels: [
      {
        title: 'Digital Presence and Platform Launch',
        copy: 'Best for businesses that need a professional website, stronger online presence, and structured digital foundations.'
      },
      {
        title: 'Commerce, Software, and App Build',
        copy: 'Ideal for businesses launching ecommerce systems, custom software, business applications, or mobile products.'
      },
      {
        title: 'Growth, Support, and Collaboration',
        copy: 'Ongoing SEO, branding, maintenance, support, infrastructure, and technical collaboration for teams growing digitally.'
      }
    ],
    serviceDepth: [
      {
        title: 'Digital platforms with business structure',
        copy: 'From websites to software systems, CodexWEBZ builds platforms that are practical to operate, scalable to improve, and aligned with real business goals.'
      },
      {
        title: 'Commerce and operational systems',
        copy: 'Ecommerce platforms, business software, internal tools, and integrations are shaped around day-to-day workflows and customer journeys.'
      },
      {
        title: 'Visibility, branding, and growth support',
        copy: 'SEO, digital marketing, social media, creative assets, and content support help businesses present themselves more clearly and reach customers more effectively.'
      },
      {
        title: 'Reliable post-launch support',
        copy: 'Maintenance, infrastructure, monitoring, and technical support keep digital systems stable, secure, and useful after launch.'
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
      'Organizations replacing fragmented digital tools with dependable platforms',
      'Agencies and partner teams needing dependable development support'
    ],
    faqs: [
      {
        question: 'Can service content be updated after launch?',
        answer: 'Yes. Service pages, descriptions, media, and metadata remain editable from the role-based dashboard.'
      },
      {
        question: 'Are the services standalone or connected?',
        answer: 'They can be delivered individually or combined into a broader digital system that supports websites, software, visibility, and operations together.'
      },
      {
        question: 'Does CodexWEBZ only build websites?',
        answer: 'No. The service scope also covers ecommerce, custom software, mobile apps, SEO, branding, maintenance, cloud support, and technical collaboration.'
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
      'Client project work is presented as a practical business solution rather than visual mockups alone.',
      'All client project records stay editable from the dashboard after launch.'
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
    serviceGroups: marketingServices,
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
