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
    heroTitle: 'Systems for scalable global commerce.',
    heroSubtitle: 'Kuwexa Private Limited bridges physical supply chains and digital innovation through global trade, consumer commerce, and technology enablement.',
    proofStats: [
      {
        value: '3',
        label: 'Core operating pillars',
        copy: 'Global trade, consumer lifestyle commerce, and CodexWEBZ digital innovation work together inside one hybrid parent.'
      },
      {
        value: '1',
        label: 'Hybrid operating model',
        copy: 'Kuwexa combines physical supply chains with digital systems so execution stays grounded in real operations.'
      },
      {
        value: 'Ethics',
        label: 'Delivery philosophy',
        copy: 'The organization is built around operational discipline, documented outcomes, and predictable performance.'
      },
      {
        value: 'Global',
        label: 'Growth direction',
        copy: 'The mission is to help businesses expand their reach with dependable commerce and technology infrastructure.'
      }
    ],
    highlights: [
      {
        title: 'Kuwexa Global Trade',
        copy: 'Physical supply chain understanding gives the organization stronger commercial context, sourcing awareness, and operational realism.'
      },
      {
        title: 'Consumer lifestyle commerce',
        copy: 'Through Kuwexa.com, the business is building a B2C ecosystem around lifestyle, fashion, home essentials, and modern customer access.'
      },
      {
        title: 'CodexWEBZ digital innovation',
        copy: 'The technology division builds websites, digital systems, and scalable platforms that improve efficiency and customer engagement.'
      }
    ],
    workflow: [
      {
        step: '01',
        title: 'Map the operating reality',
        copy: 'Every engagement starts with the commercial, operational, or customer challenge that needs structure.'
      },
      {
        step: '02',
        title: 'Design the right system',
        copy: 'Trade workflows, digital storefronts, and technology platforms are aligned to the real operating model instead of isolated tasks.'
      },
      {
        step: '03',
        title: 'Document and deliver',
        copy: 'Execution focuses on discipline, documented outcomes, and reusable systems that teams can run with confidence.'
      },
      {
        step: '04',
        title: 'Scale with confidence',
        copy: 'The result is a stronger ecosystem for trade, commerce, and technology-enabled growth over time.'
      }
    ],
    ecosystemPillars: [
      {
        label: 'Physical Supply Chain',
        title: 'Kuwexa Global Trade',
        copy: 'B2B import-export capability built around dependable sourcing, structured operations, and wider market access.',
        href: '/about-us'
      },
      {
        label: 'Digital Commerce',
        title: 'Kuwexa.com',
        copy: 'A growing consumer lifestyle platform connecting curated products with modern digital commerce experiences.',
        href: '/services'
      },
      {
        label: 'Digital Innovation',
        title: 'CodexWEBZ',
        copy: 'Websites, operational systems, and scalable platforms that strengthen efficiency, visibility, and customer engagement.',
        href: '/services'
      }
    ],
    hybridAdvantage: [
      {
        title: 'Operational discipline',
        copy: 'The Kuwexa way replaces reactive firefighting with documented, repeatable execution.'
      },
      {
        title: 'Systems over shortcuts',
        copy: 'Technology and commerce are treated as operating systems, not disconnected tasks or vague promises.'
      },
      {
        title: 'Predictable performance',
        copy: 'Trade awareness plus digital capability creates clearer delivery expectations and stronger long-term sustainability.'
      }
    ],
    leadershipSnapshot: [
      { name: 'Govind Jha', role: 'CEO and Co-Founder' },
      { name: 'Kundan Kumar', role: 'COO and Co-Founder' },
      { name: 'Ravi Raj', role: 'CFO and Co-Founder' }
    ],
    divisionServicesLabel: 'Technology Enablement by CodexWEBZ',
    faqs: [
      {
        question: 'What is Kuwexa Private Limited?',
        answer: 'Kuwexa Private Limited is a hybrid company working across global ecommerce, B2B import-export, and technology enablement.'
      },
      {
        question: 'How does CodexWEBZ fit into Kuwexa?',
        answer: 'CodexWEBZ is the digital innovation and technology division of Kuwexa, focused on websites, digital systems, and scalable platforms.'
      },
      {
        question: 'What does Kuwexa.com represent?',
        answer: 'Kuwexa.com is the consumer lifestyle commerce arm, focused on curated B2C categories such as fashion, home essentials, and accessories.'
      },
      {
        question: 'Why is the hybrid model important?',
        answer: 'It lets Kuwexa connect physical supply-chain understanding with digital systems, so businesses get solutions shaped by real operating needs.'
      }
    ],
    capabilityBands: [
      'Global Trade',
      'B2B Import Export',
      'Consumer Lifestyle',
      'Digital Commerce',
      'CodexWEBZ',
      'Scalable Platforms'
    ],
    jobsSummary: jobs.length ? `${jobs.length} open roles are currently live across the growing Kuwexa ecosystem.` : 'Career workflows are ready whenever new commerce or technology roles are published.'
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
        title: 'Hybrid commerce enablement',
        copy: 'Best for businesses aligning sourcing, market access, storefront visibility, and operational systems together.'
      },
      {
        title: 'Digital commerce and platform build',
        copy: 'Ideal for teams launching ecommerce systems, custom software, business applications, or scalable digital experiences.'
      },
      {
        title: 'Long-term support and collaboration',
        copy: 'Ongoing SEO, maintenance, infrastructure, and technology partnership for businesses expanding with discipline.'
      }
    ],
    serviceDepth: [
      {
        title: 'Technology inside a broader operating model',
        copy: 'These capabilities sit inside the wider Kuwexa ecosystem, which means the work is shaped by real trade and commerce realities, not generic templates.'
      },
      {
        title: 'Commerce and customer journeys',
        copy: 'Ecommerce platforms, business software, internal tools, and integrations are structured around practical workflows and measurable outcomes.'
      },
      {
        title: 'Visibility, branding, and growth',
        copy: 'SEO, digital marketing, social media, and content systems help businesses present themselves with more clarity and stronger reach.'
      },
      {
        title: 'Reliable post-launch continuity',
        copy: 'Maintenance, infrastructure, monitoring, and technical support keep the systems stable, manageable, and ready for future scale.'
      }
    ],
    workflow: [
      {
        step: '01',
        title: 'Understand the commercial goal',
        copy: 'Every engagement starts with the business objective, operating challenge, and market reality involved.'
      },
      {
        step: '02',
        title: 'Define the right capability mix',
        copy: 'The scope is aligned to business priorities, platform needs, and the most practical implementation route.'
      },
      {
        step: '03',
        title: 'Build the working system',
        copy: 'Frontend, backend, integrations, content structure, and workflow logic are delivered as one consistent operating layer.'
      },
      {
        step: '04',
        title: 'Support steady growth',
        copy: 'After launch, the system can continue improving through support, optimization, and additional delivery phases.'
      }
    ],
    audiences: [
      'Businesses expanding into wider digital or global markets',
      'Brands building consumer commerce experiences and structured online visibility',
      'Organizations replacing fragmented tools with dependable digital systems',
      'SMEs needing scalable websites, commerce flows, and operational clarity',
      'Partner teams seeking dependable technology execution through CodexWEBZ'
    ],
    faqs: [
      {
        question: 'Are these services offered directly by Kuwexa?',
        answer: 'Yes. The public capability stack is presented under Kuwexa, with many digital services delivered through the CodexWEBZ division.'
      },
      {
        question: 'Can the services be combined?',
        answer: 'Yes. They can be delivered individually or combined into a broader ecosystem that supports trade, commerce, visibility, and operations together.'
      },
      {
        question: 'Is this only about websites?',
        answer: 'No. The scope also covers ecommerce, software, mobile apps, SEO, branding, maintenance, infrastructure, and technology collaboration.'
      }
    ]
  };
}

function getProductsPageContent(products = []) {
  return {
    categories: ['All Products', ...new Set(products.map((product) => (product.status === 'published' ? 'Published' : 'Draft')))],
    values: [
      'Each ecosystem platform can be presented with overview, features, screenshots, technology stack, and action links.',
      'Admin and manager roles can update product content, images, alt text, and publishing state directly from the dashboard.',
      'The platform module lets Kuwexa present internal tools, venture products, or managed software experiences with the same brand system.'
    ]
  };
}

function getProjectsPageContent(projects = []) {
  return {
    categories: ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))],
    values: [
      'Each initiative connects business objective, delivery approach, technology choices, and measurable outcome.',
      'Execution stories are presented as practical operating systems rather than visual mockups alone.',
      'All initiative records stay editable from the dashboard after launch.'
    ]
  };
}

function getBlogPageContent(posts = []) {
  return {
    categories: ['All', ...new Set(posts.map((post) => post.category).filter(Boolean))],
    editorialPrinciples: [
      'Write from implementation and operating experience, not abstract trend-chasing.',
      'Connect digital growth with real systems and commercial clarity.',
      'Keep the CMS practical enough for teams to maintain without engineering bottlenecks.'
    ]
  };
}

function getCareersPageContent(jobs = []) {
  return {
    locations: ['All', ...new Set(jobs.map((job) => job.location).filter(Boolean))],
    employmentTypes: ['All', ...new Set(jobs.map((job) => job.employment_type).filter(Boolean))],
    values: [
      {
        title: 'Systems over shortcuts',
        copy: 'Work is measured by dependable execution and documented outcomes, not performance theatre.'
      },
      {
        title: 'Clarity over noise',
        copy: 'The team values direct communication, operational discipline, and short feedback loops.'
      },
      {
        title: 'Hybrid thinking',
        copy: 'Projects connect commerce, operations, customer experience, and engineering instead of living in silos.'
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
        answer: 'Resumes, statuses, and candidate workflow all sit inside the management dashboard with role-based access and image-alt-ready media handling.'
      },
      {
        question: 'What kind of team is Kuwexa building?',
        answer: 'Roles support the broader hybrid ecosystem, including digital platforms, commerce operations, marketing visibility, and structured delivery.'
      }
    ]
  };
}

function getContactPageContent() {
  return {
    promises: [
      'Clear discovery and response process for every inquiry',
      'Lead record created inside the dashboard for structured follow-up',
      'Commercial and operational context reviewed before implementation begins',
      'Delivery support aligned to practical timelines and market realities'
    ],
    engagementModels: [
      {
        title: 'Trade and ecosystem conversations',
        copy: 'Best for businesses exploring supply-chain support, B2B trade alignment, or wider market access.'
      },
      {
        title: 'Digital commerce and platforms',
        copy: 'Ideal for website builds, ecommerce systems, customer journeys, and digital platform strategy.'
      },
      {
        title: 'Technology enablement by CodexWEBZ',
        copy: 'Useful for custom software, integrations, SEO systems, maintenance, and operational digital support.'
      }
    ],
    contactCards: [
      {
        title: 'Plan a new ecosystem move',
        copy: 'Best for new trade, digital commerce, platform, or technology initiatives.'
      },
      {
        title: 'Improve an existing system',
        copy: 'Useful when the current workflow, storefront, website, or software platform needs stronger structure and usability.'
      },
      {
        title: 'Build long-term support',
        copy: 'Ideal for companies that need maintenance, issue resolution, growth support, and continuous improvement.'
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
      'The current problem, gap, or market/operations issue',
      'Required integrations, channels, or systems involved',
      'Expected timeline or urgency',
      'Whether the need is a new build, upgrade, trade support, or ongoing partnership'
    ],
    faqs: [
      {
        question: 'What should be included in the inquiry?',
        answer: 'Share the business goal, current challenge, required channel or service, timeline, and any systems that need to be integrated or improved.'
      },
      {
        question: 'Can Kuwexa handle both strategy and execution?',
        answer: 'Yes. The organization can support planning, commerce workflows, websites, software interfaces, backend workflows, and long-term operational delivery.'
      }
    ]
  };
}

function getAboutPageContent() {
  return {
    eyebrow: 'About Kuwexa',
    title: 'A hybrid parent company where commerce and technology work together.',
    intro: 'Kuwexa Private Limited is a hybrid company working across global ecommerce, B2B import-export, and technology enablement.',
    overview: 'Through Kuwexa.com, the organization is building a consumer lifestyle commerce platform, while CodexWEBZ supports organizations by building websites, digital systems, and scalable platforms that improve efficiency and customer engagement.',
    summary: 'By combining trade capabilities with technology support, Kuwexa focuses on helping businesses operate with clarity, structure, and long-term sustainability.',
    highlights: [
      {
        title: 'Hybrid advantage',
        copy: 'Kuwexa connects physical supply chains and digital innovation so execution is grounded in real business realities.'
      },
      {
        title: 'Systems over shortcuts',
        copy: 'The operating philosophy emphasizes discipline, documentation, and predictable performance over reactive firefighting.'
      },
      {
        title: 'Delivery with ethics',
        copy: 'The organization is designed to turn ambition into repeatable business performance with dependable methods and clear outcomes.'
      }
    ],
    narrative: [
      'Kuwexa is structured as a parent organization that supports growth through trade capability, digital commerce, and technology systems rather than treating them as isolated silos.',
      'The model creates a stronger bridge between market access, sourcing, customer experience, and the digital infrastructure needed to scale steadily.',
      'This hybrid structure helps businesses move from chaos to capability through documented processes, clearer decisions, and more dependable execution.'
    ],
    vision: 'To build a globally trusted ecosystem where commerce and technology work together to empower businesses and drive sustainable success across markets.',
    visionPoints: [
      'Create a globally trusted ecosystem where commerce and technology reinforce each other.',
      'Empower businesses to grow with stronger market connectivity, clearer systems, and sustainable execution.',
      'Build long-term capability instead of short-term patches.'
    ],
    mission: 'To support businesses with dependable trade solutions and digital systems that enhance operations, improve connectivity, and enable steady growth.',
    focusAreas: [
      'Global trade and market access',
      'Consumer ecommerce ecosystem building',
      'Digital innovation through CodexWEBZ',
      'Operational systems that support long-term sustainability'
    ],
    serviceGroups: [
      'Kuwexa Global Trade',
      'Kuwexa.com Consumer Lifestyle',
      'CodexWEBZ Digital Innovation',
      'B2B Import Export',
      'Digital Commerce Infrastructure',
      'Scalable Business Systems'
    ],
    principles: [
      {
        title: 'Operational discipline',
        copy: 'The Kuwexa way replaces reactive firefighting with systems that are documented, understandable, and manageable.'
      },
      {
        title: 'Documented outcomes',
        copy: 'Success is measured through clarity, consistency, and the ability to repeat performance across markets and channels.'
      },
      {
        title: 'Predictable performance',
        copy: 'The organization aims to make commerce and technology execution more dependable, transparent, and sustainable.'
      }
    ],
    audience: [
      'Businesses expanding into wider local or global markets',
      'Brands building consumer commerce and digital presence together',
      'Organizations needing websites, software, or scalable digital systems',
      'Partners seeking structured trade and technology support'
    ],
    approach: [
      {
        title: 'Understand the market and operating need',
        copy: 'Every engagement starts with the company context, the operational challenge, and the intended growth outcome.'
      },
      {
        title: 'Align commerce and systems',
        copy: 'Trade workflows, ecommerce channels, and technology structure are planned around clarity, usability, and maintainability.'
      },
      {
        title: 'Deliver with documented execution',
        copy: 'The build phase focuses on reliable execution, stable systems, and practical operating documentation.'
      },
      {
        title: 'Support steady scale',
        copy: 'After launch, the ecosystem can keep improving through maintenance, optimization, and ongoing commercial or technical support.'
      }
    ],
    advantages: [
      'Hybrid parent organization across trade and technology',
      'Consumer, B2B, and digital capability inside one ecosystem',
      'CodexWEBZ as a dedicated digital innovation division',
      'Strong focus on ethics, documented outcomes, and sustainable growth'
    ],
    closing: 'At its core, Kuwexa believes businesses scale better when commerce and technology reinforce each other. Whether the need is market expansion, digital commerce, or scalable systems, the goal is to become a trusted long-term partner.'
  };
}

function getTeamPageContent(teamShowcase = { leadership: [], employees: [] }) {
  return {
    eyebrow: 'Leadership',
    title: 'Leadership, specialists, and delivery roles behind Kuwexa.',
    intro: 'Kuwexa is guided by leadership focused on hybrid commerce and supported by teams turning business needs into trade, digital, and technology execution.',
    values: [
      {
        title: 'Business-aligned thinking',
        copy: 'The team approaches delivery with a clear understanding of both practical commercial needs and technical execution.'
      },
      {
        title: 'Dependable execution',
        copy: 'Every profile contributes to structured delivery, stable systems, and reliable support across initiatives.'
      },
      {
        title: 'Growth with discipline',
        copy: 'The goal is to build systems and workflows that remain scalable, manageable, and practical for businesses over time.'
      }
    ],
    metrics: [
      { label: 'Leadership Profiles', value: String(teamShowcase.leadership?.length || 0) },
      { label: 'Employee Profiles', value: String(teamShowcase.employees?.length || 0) },
      { label: 'Core Pillars', value: '3' }
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
