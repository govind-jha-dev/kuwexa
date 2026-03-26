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
    summary: 'Business software, tailored digital tools, and custom applications designed around real commercial requirements.',
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
    summary: 'Long-term support, technical maintenance, and optimization for businesses running active digital properties.',
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
    summary: 'Hosting, deployment, server setup, and monitoring support for dependable production environments.',
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
    kicker: 'Build business-ready websites and web experiences that stay practical after launch.',
    deliverables: [
      'Business and corporate websites',
      'Landing pages and portfolio websites',
      'Custom web applications and PWAs',
      'Responsive design and content-ready delivery'
    ],
    outcomes: [
      'Stronger digital presence for the business',
      'Better usability across devices and teams',
      'A scalable web foundation for future growth'
    ],
    process: [
      'Requirement discovery and page mapping',
      'UI structure and technical planning',
      'Development, content setup, and QA',
      'Launch support and ongoing optimization'
    ]
  },
  {
    key: 'ecommerce-solutions',
    matches: ['ecommerce', 'seller', 'amazon', 'flipkart', 'marketplace', 'store', 'catalog', 'payment gateway'],
    category: 'Ecommerce Solutions',
    kicker: 'Launch and manage online sales experiences with dependable storefront and marketplace support.',
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
      'Marketplace and seller coordination',
      'Testing, launch, and support'
    ]
  },
  {
    key: 'software-development',
    matches: ['software', 'crm', 'saas', 'api', 'internal business', 'business software', 'system'],
    category: 'Software Development',
    kicker: 'Turn business requirements into tailored software and digital tools that support real operations.',
    deliverables: [
      'Custom software and internal business tools',
      'CRM and operations support tools',
      'API integrations and data connections',
      'Application architecture support'
    ],
    outcomes: [
      'More efficient internal operations',
      'Less dependency on disconnected third-party tools',
      'Digital tools shaped around real business processes'
    ],
    process: [
      'Business requirement mapping',
      'Architecture and feature planning',
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
      'Business mobile support experiences',
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
    kicker: 'Keep digital experiences stable, secure, and effective after the initial build is complete.',
    deliverables: [
      'Technical support and issue resolution',
      'Website maintenance and security updates',
      'Performance optimization work',
      'Bug fixing and troubleshooting'
    ],
    outcomes: [
      'Lower risk of downtime or service degradation',
      'More dependable day-to-day operations',
      'Ongoing improvement without rebuilding from scratch'
    ],
    process: [
      'Website review and issue identification',
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
      'Technical monitoring and oversight',
      'Infrastructure aligned to business growth needs'
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
    'Responsive user experience and structured delivery',
    'Content, metadata, and ongoing support',
    'Launch-ready delivery with room to scale'
  ],
  outcomes: [
    'Cleaner digital operations and customer journeys',
    'More dependable delivery quality',
    'Digital work that remains dependable after launch'
  ],
  process: [
    'Discovery and scope alignment',
    'Solution design and structure',
    'Implementation and QA',
    'Launch, support, and iteration'
  ]
};

const divisionDirectory = [
  {
    slug: 'codexwebz',
    name: 'CodexWEBZ',
    label: 'Digital Innovation Division',
    shortDescription: 'The technology and digital execution arm of Kuwexa, focused on websites, business software, automation, and growth-ready digital infrastructure.',
    summary: 'CodexWEBZ helps brands and businesses launch polished digital experiences backed by clear planning and dependable delivery.',
    detailNarrative: 'CodexWEBZ combines premium web presentation with commercial clarity. It is built for businesses that need a stronger digital presence, cleaner customer journeys, and delivery that still feels practical after launch.',
    detailPath: '/divisions/codexwebz',
    destinationUrl: 'https://www.codexwebz.com',
    destinationLabel: 'Visit CodexWEBZ',
    destinationHost: 'www.codexwebz.com',
    ecosystemRole: 'CodexWEBZ is the technology enablement division inside the Kuwexa organization, turning business requirements into websites, software, and digital experiences that remain useful after launch.',
    marketFocus: [
      'Business websites and brand presentation',
      'Digital enablement and tailored business tools',
      'Customer-facing experiences and software support',
      'Automation, integrations, and practical delivery'
    ],
    primaryPoints: [
      'Business websites and landing pages',
      'Business tools and tailored software',
      'Custom integrations and automation',
      'Digital growth infrastructure and SEO-ready builds'
    ],
    operatingModel: [
      'Discovery and business context mapping',
      'Design-led website and experience planning',
      'Delivery, QA, launch, and optimization support'
    ],
    signatureAreas: [
      'Premium company websites that look credible on desktop and mobile',
      'Tailored internal tools and business software support',
      'Automation, integrations, and custom digital solutions',
      'Search-ready page architecture and content direction'
    ],
    experiencePillars: [
      {
        title: 'Brand-first execution',
        copy: 'Every build is designed to strengthen trust, clarity, and perceived quality before the first sales conversation even begins.'
      },
      {
        title: 'Operational usefulness',
        copy: 'Public experience, content structure, and business needs are shaped together so the work remains useful after launch.'
      },
      {
        title: 'Scalable delivery',
        copy: 'CodexWEBZ is structured for businesses that want a polished digital presence today and room to expand their capabilities later.'
      }
    ],
    journeySteps: [
      {
        step: '01',
        title: 'Clarify the business story',
        copy: 'Map what the brand needs to communicate and where the current digital experience is weak.'
      },
      {
        step: '02',
        title: 'Shape the right experience',
        copy: 'Translate that story into a more persuasive website, a clearer user journey, and stronger digital support.'
      },
      {
        step: '03',
        title: 'Launch with confidence',
        copy: 'Ship the site or digital experience with careful handoff quality for long-term use.'
      }
    ],
    highlightStats: [
      { value: 'Web', label: 'Company websites' },
      { value: 'Build', label: 'Software support' },
      { value: 'SEO', label: 'Search-ready structure' }
    ],
    audiences: [
      'Service brands building stronger digital credibility',
      'Businesses replacing manual internal processes',
      'Founders needing a technical execution partner'
    ]
  },
  {
    slug: 'kuwexa-lifestyle',
    name: 'Kuwexa Lifestyle',
    label: 'Lifestyle Commerce Division',
    shortDescription: 'The consumer-facing division of Kuwexa, focused on lifestyle categories, curated product experiences, and a modern D2C brand journey.',
    summary: 'Kuwexa Lifestyle is where the parent company presents its consumer product vision through design, curation, and accessible digital commerce.',
    detailNarrative: 'Kuwexa Lifestyle is about turning product curation into a refined customer experience. The division focuses on presentation, category storytelling, and a modern shopping rhythm that feels elevated without becoming noisy.',
    detailPath: '/divisions/kuwexa-lifestyle',
    destinationUrl: 'https://www.kuwexa.com',
    destinationLabel: 'Visit Kuwexa Lifestyle',
    destinationHost: 'www.kuwexa.com',
    ecosystemRole: 'Through Kuwexa.com, this division builds the consumer-facing side of the company with curated B2C categories, stronger brand presentation, and a more reliable digital commerce experience.',
    marketFocus: [
      'Lifestyle goods',
      'Fashion-led product presentation',
      'Home essentials and everyday utility lines',
      'Consumer accessories supported by curated merchandising'
    ],
    primaryPoints: [
      'Lifestyle and consumer product storytelling',
      'Curated category-led shopping experiences',
      'Brand building through modern ecommerce presentation',
      'Long-term D2C expansion under the Kuwexa umbrella'
    ],
    operatingModel: [
      'Category and customer journey planning',
      'Brand presentation and merchandising alignment',
      'Commerce growth through curated launches and updates'
    ],
    signatureAreas: [
      'Lifestyle category merchandising with a curated digital shelf',
      'Brand storytelling shaped around mood, utility, and presentation',
      'Mobile-first browsing experience for modern shoppers',
      'Editorial product presentation that feels cleaner and more premium'
    ],
    experiencePillars: [
      {
        title: 'Curated discovery',
        copy: 'Products are grouped and presented in ways that feel intentional, browseable, and visually confident.'
      },
      {
        title: 'Brand atmosphere',
        copy: 'The division is built to communicate a lifestyle mood, not just a list of items, so the experience feels more memorable.'
      },
      {
        title: 'Commerce readiness',
        copy: 'Behind the brand story is a practical ecommerce direction designed for future category growth and smoother customer journeys.'
      }
    ],
    journeySteps: [
      {
        step: '01',
        title: 'Curate the category mix',
        copy: 'Define which lifestyle categories should lead and how they should feel when a shopper first lands.'
      },
      {
        step: '02',
        title: 'Shape the brand presentation',
        copy: 'Build product stories, category pages, and merchandising moments that feel premium and cohesive.'
      },
      {
        step: '03',
        title: 'Grow the customer experience',
        copy: 'Expand the product journey with cleaner storytelling, better navigation, and stronger visual consistency.'
      }
    ],
    highlightStats: [
      { value: 'D2C', label: 'Consumer experience' },
      { value: 'Curated', label: 'Category storytelling' },
      { value: 'Mobile', label: 'Browsing rhythm' }
    ],
    audiences: [
      'Lifestyle shoppers discovering the Kuwexa brand',
      'Customers looking for a curated digital shopping experience',
      'Future consumer categories launched by the parent company'
    ]
  },
  {
    slug: 'b2b',
    name: 'Kuwexa B2B',
    label: 'Business Supply Division',
    shortDescription: 'The wholesale and B2B product division where buyers can browse categorized products and send a single enquiry for multiple items.',
    summary: 'Kuwexa B2B gives the company a structured wholesale catalog with category navigation, product detail, and a clearer buyer enquiry path.',
    detailNarrative: 'Kuwexa B2B is built around practical wholesale discovery. Categories, product detail, images, and enquiries are arranged so buyers can move with more confidence while the company presents its wholesale capability with clarity.',
    detailPath: '/b2b',
    destinationUrl: '/b2b',
    destinationLabel: 'Open B2B Catalog',
    destinationHost: 'kuwexa.com/b2b',
    ecosystemRole: 'Kuwexa B2B brings supply-side conversations into a cleaner digital format so wholesale buyers can browse categories, compare products, and send enquiries with stronger context.',
    marketFocus: [
      'Dry fruits',
      'Spices',
      'Woollen products',
      'Cereals / grains and other wholesale lines'
    ],
    primaryPoints: [
      'Category-led product discovery for wholesale buyers',
      'Detailed product pages with images and highlights',
      'Single enquiry path for multiple products',
      'Wholesale presentation that stays connected to the parent company'
    ],
    operatingModel: [
      'Products grouped into clear wholesale categories',
      'Public catalog pages kept current across the company site',
      'Buyer enquiries gathered with relevant product context'
    ],
    signatureAreas: [
      'Product categories such as dry fruits, spices, woollen products, and cereals or grains',
      'Image-rich product pages with highlights, MOQ, and brochure links',
      'Multi-product enquiries gathered in one clear conversation',
      'Product presentation designed for continuity across the Kuwexa website'
    ],
    experiencePillars: [
      {
        title: 'Category-led discovery',
        copy: 'The catalog is designed so buyers can jump straight into the product family they need instead of scrolling through one long list.'
      },
      {
        title: 'Better buyer context',
        copy: 'Each product page can show images, highlights, quantity details, and supporting links before the enquiry is even submitted.'
      },
      {
        title: 'Commercial continuity',
        copy: 'The catalog stays aligned with the parent-company story so wholesale discovery feels credible, connected, and easy to follow.'
      }
    ],
    journeySteps: [
      {
        step: '01',
        title: 'Shape the category structure',
        copy: 'Organize products into clear wholesale groups such as dry fruits, spices, woollen products, or cereals and grains.'
      },
      {
        step: '02',
        title: 'Present the product details',
        copy: 'Add descriptions, highlights, order details, and multiple images for every product record.'
      },
      {
        step: '03',
        title: 'Capture product-linked enquiries',
        copy: 'Let buyers choose one or more products in a single enquiry so the sales follow-up starts with proper context.'
      }
    ],
    highlightStats: [
      { value: 'Bulk', label: 'Wholesale discovery' },
      { value: 'Multi', label: 'Product enquiries' },
      { value: 'One', label: 'Company website' }
    ],
    audiences: [
      'Wholesale buyers exploring multiple product lines',
      'Procurement teams requesting quotes for multiple products',
      'Partners needing a clear product discovery and enquiry flow'
    ]
  }
];

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
  const divisions = getDivisionDirectory();

  return {
    heroTitle: 'Kuwexa brings trade, technology, and growth into one clear operating company.',
    heroSubtitle: 'Kuwexa Private Limited brings digital innovation, consumer commerce, and B2B supply capability into one structured organization with clearer accountability and direction.',
    heroChips: [
      'Kuwexa parent company',
      'Trade + digital execution',
      'Three operating divisions'
    ],
    companyDossier: [
      { label: 'Company Model', value: 'A parent-company presence built to guide people with more clarity and confidence.' },
      { label: 'Operating Style', value: 'Structured execution, cleaner ownership, and public communication that feels accountable.' },
      { label: 'Commercial Lens', value: 'Trade-aware thinking shaped around practical growth conversations instead of vague branding.' },
      { label: 'Brand Direction', value: 'A long-term Kuwexa identity designed to scale without losing consistency or trust.' }
    ],
    introParagraphs: [
      'Kuwexa Private Limited operates as an organization, not a generic brand shell. It brings together global ecommerce perspective, B2B import-export thinking, and technology enablement so every public touchpoint supports a real operating model.',
      'From division discovery to wholesale enquiries and digital execution conversations, the company website is designed to guide people toward the right part of the business with clarity and confidence.'
    ],
    identityCards: [
      {
        title: 'Global ecommerce perspective',
        copy: 'Kuwexa is designed for businesses that need broader market reach, stronger digital presentation, and clearer operating structure.'
      },
      {
        title: 'B2B import-export mindset',
        copy: 'The company story is grounded in real supply-side thinking, not only marketing language, which gives the B2B experience more practical depth.'
      },
      {
        title: 'Technology enablement',
        copy: 'CodexWEBZ supports organizations with websites, tailored digital experiences, and practical technology delivery that improves visibility and execution.'
      }
    ],
    visionCard: {
      title: 'Vision',
      copy: 'To build a globally trusted organization where commerce and technology work together to create sustainable progress across markets.'
    },
    missionCard: {
      title: 'Mission',
      copy: 'To support businesses with dependable trade solutions, stronger digital presence, and practical execution that enables steady growth.'
    },
    ethosCard: {
      title: 'Delivery with ethics',
      copy: 'Kuwexa aims to be the trusted global partner for ecommerce and technology by turning ambition into repeatable business performance.'
    },
    proofStats: [
      {
        value: '3',
        label: 'Focused divisions',
        copy: 'CodexWEBZ, Kuwexa Lifestyle, and Kuwexa B2B each serve a distinct role inside the parent company.'
      },
      {
        value: '1',
        label: 'Parent identity',
        copy: 'The main Kuwexa website now acts as the company layer that introduces the divisions and connects visitors to the right destination.'
      },
      {
        value: 'B2B',
        label: 'Wholesale presence',
        copy: 'The wholesale catalog, product detail, and buyer enquiries live naturally inside the main Kuwexa company experience.'
      },
      {
        value: 'Live',
        label: 'Separate destinations',
        copy: 'Division detail pages can route visitors to dedicated properties like CodexWEBZ and Kuwexa Lifestyle while keeping B2B on the company domain.'
      }
    ],
    divisions,
    highlights: [
      {
        title: 'Defined organizational structure',
        copy: 'Kuwexa introduces the parent company, the business units, and the right path for partners, buyers, and clients without mixing the messages.'
      },
      {
        title: 'Commercial and digital capability',
        copy: 'The organization combines supply-side understanding, lifestyle commerce, and digital execution so each division contributes to a stronger shared company presence.'
      },
      {
        title: 'Credibility through clarity',
        copy: 'Leadership visibility, disciplined presentation, and cleaner routing make the organization feel accountable instead of promotional.'
      }
    ],
    workflow: [
      {
        step: '01',
        title: 'Start with the organization',
        copy: 'Present Kuwexa as the parent company so visitors first understand the business model, leadership direction, and company structure.'
      },
      {
        step: '02',
        title: 'Guide each audience clearly',
        copy: 'Move partners, buyers, and digital clients toward the correct division based on their commercial or operational need.'
      },
      {
        step: '03',
        title: 'Support deeper conversations',
        copy: 'Use richer division pages, product detail, and leadership visibility to give every next step more context and trust.'
      },
      {
        step: '04',
        title: 'Keep the company current',
        copy: 'Products, team visibility, and division information stay current so the public experience remains credible as the business grows.'
      }
    ],
    ecosystemPillars: [
      {
        label: 'Digital Innovation',
        title: 'CodexWEBZ',
        copy: 'Websites, software, automation, and digital execution under the Kuwexa umbrella.',
        href: '/divisions/codexwebz'
      },
      {
        label: 'Lifestyle Commerce',
        title: 'Kuwexa Lifestyle',
        copy: 'The consumer division focused on curated lifestyle categories and modern ecommerce presentation.',
        href: '/divisions/kuwexa-lifestyle'
      },
      {
        label: 'Business Supply',
        title: 'Kuwexa B2B',
        copy: 'Category-led wholesale discovery with product detail and a clearer buyer enquiry path.',
        href: '/b2b'
      }
    ],
    hybridAdvantage: [
      {
        title: 'Operational discipline',
        copy: 'Kuwexa is built around documented, more predictable execution instead of reactive firefighting.'
      },
      {
        title: 'Substance over shortcuts',
        copy: 'The company treats trade, digital presentation, and follow-through as one connected standard rather than separate tasks.'
      },
      {
        title: 'Predictable performance',
        copy: 'The goal is to reduce chaos, make outcomes clearer, and help businesses scale with steadier control.'
      }
    ],
    hybridContrast: {
      industryNorm: [
        'Reactive firefighting',
        'Unstable technology',
        'Opaque supply chains',
        'Vague promises'
      ],
      kuwexaWay: [
        'Operational discipline',
        'Substance over shortcuts',
        'Documented outcomes',
        'Predictable performance'
      ],
      closingQuote: 'Trade awareness, digital clarity, and disciplined execution move together at Kuwexa.'
    },
    ecosystemMap: [
      {
        label: 'Parent Company',
        title: 'Kuwexa Private Limited',
        copy: 'The main company layer that introduces the business, defines the structure, and connects visitors to the correct division.'
      },
      {
        label: 'Physical Supply Chain',
        title: 'Kuwexa B2B',
        copy: 'Wholesale discovery, product categories, and product-linked enquiries shaped for real supply-side conversations.'
      },
      {
        label: 'Consumer Lifestyle',
        title: 'Kuwexa Lifestyle',
        copy: 'The B2C side of the organization with curated categories such as lifestyle goods, fashion, home essentials, and accessories.'
      },
      {
        label: 'Digital Innovation',
        title: 'CodexWEBZ',
        copy: 'The technology division delivering websites, digital experiences, and dependable execution support.'
      }
    ],
    consumerCategories: [
      'Lifestyle goods',
      'Fashion',
      'Home essentials',
      'Consumer accessories'
    ],
    leadershipSnapshot: [
      { name: 'Govind Jha', role: 'CEO and Co-Founder' },
      { name: 'Kundan Kumar', role: 'COO and Co-Founder' },
      { name: 'Ravi Raj', role: 'CFO and Co-Founder' }
    ],
    divisionServicesLabel: 'Division Directory',
    b2bHighlights: [
      'Wholesale categories are presented with the same Kuwexa identity used across the wider organization.',
      'Each product page gives buyers clearer detail, images, MOQ guidance, and a more credible first impression.',
      'One enquiry form allows buyers to express interest in multiple products within a single conversation.'
    ],
    faqs: [
      {
        question: 'What is Kuwexa Private Limited?',
        answer: 'Kuwexa Private Limited is the parent company website that introduces the business and its three operating divisions.'
      },
      {
        question: 'How does CodexWEBZ fit into Kuwexa?',
        answer: 'CodexWEBZ is the digital innovation division of Kuwexa, focused on websites, software, automation, and digital execution.'
      },
      {
        question: 'What is Kuwexa Lifestyle?',
        answer: 'Kuwexa Lifestyle is the consumer-facing division focused on lifestyle commerce and curated product experiences.'
      },
      {
        question: 'What can visitors do on the B2B section?',
        answer: 'Visitors can browse products by category, open product details, and submit one enquiry for multiple selected products.'
      }
    ],
    capabilityBands: [
      'Parent Company',
      'CodexWEBZ',
      'Kuwexa Lifestyle',
      'Kuwexa B2B',
      'Wholesale Categories',
      'Buyer Enquiries'
    ],
    jobsSummary: jobs.length ? `${jobs.length} open roles are currently live across the Kuwexa organization.` : 'This website is now centered on the company story and its divisions.'
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
        copy: 'Best for businesses aligning sourcing, market access, customer presentation, and company growth together.'
      },
      {
        title: 'Digital commerce and capability build',
        copy: 'Ideal for teams launching ecommerce experiences, custom software, business applications, or stronger digital presence.'
      },
      {
        title: 'Long-term support and collaboration',
        copy: 'Ongoing SEO, maintenance, infrastructure, and technology partnership for businesses expanding with discipline.'
      }
    ],
    serviceDepth: [
      {
        title: 'Technology inside a broader operating model',
        copy: 'These capabilities sit inside the wider Kuwexa organization, which means the work is shaped by real trade and commerce realities, not generic templates.'
      },
      {
        title: 'Commerce and customer journeys',
        copy: 'Ecommerce experiences, business tools, customer journeys, and integrations are shaped around practical commercial needs and measurable outcomes.'
      },
      {
        title: 'Visibility, branding, and growth',
        copy: 'SEO, digital marketing, social media, and content direction help businesses present themselves with more clarity and stronger reach.'
      },
      {
        title: 'Reliable post-launch continuity',
        copy: 'Maintenance, infrastructure, monitoring, and technical support keep the work stable, manageable, and ready for future growth.'
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
        copy: 'The scope is aligned to business priorities, audience needs, and the most practical delivery route.'
      },
      {
        step: '03',
        title: 'Build the working solution',
        copy: 'Design, development, integrations, content structure, and quality checks are delivered as one coordinated effort.'
      },
      {
        step: '04',
        title: 'Support steady growth',
        copy: 'After launch, the work can continue improving through support, refinement, and additional delivery phases.'
      }
    ],
    audiences: [
      'Businesses expanding into wider digital or global markets',
      'Brands building consumer commerce experiences and structured online visibility',
      'Organizations replacing fragmented digital work with clearer direction and dependable execution',
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
        answer: 'Yes. They can be delivered individually or combined into a broader company offering that supports trade, commerce, visibility, and operations together.'
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
      'Each software offering can be presented with overview, features, screenshots, technology stack, and action links.',
      'Product information, visuals, and publishing status can stay current as the Kuwexa portfolio grows.',
      'This page helps Kuwexa present internal tools, venture products, or digital offerings with one consistent identity.'
    ]
  };
}

function getProjectsPageContent(projects = []) {
  return {
    categories: ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))],
    values: [
      'Each initiative connects business objective, delivery approach, technology choices, and measurable outcome.',
      'Execution stories are presented as real business case studies rather than surface-level mockups alone.',
      'Each initiative can stay current as the Kuwexa portfolio evolves.'
    ]
  };
}

function getBlogPageContent(posts = []) {
  return {
    categories: ['All', ...new Set(posts.map((post) => post.category).filter(Boolean))],
    editorialPrinciples: [
      'Write from implementation and operating experience, not abstract trend-chasing.',
      'Connect digital growth with real business context and commercial clarity.',
      'Keep the editorial process clear enough to maintain with consistency and focus.'
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
        answer: 'Applications are reviewed through an organized internal hiring process with clear status tracking and coordinated follow-up.'
      },
      {
        question: 'What kind of team is Kuwexa building?',
        answer: 'Roles support the broader Kuwexa organization across commerce, visibility, technology, and disciplined delivery.'
      }
    ]
  };
}

function getContactPageContent() {
  return {
    promises: [
      'Clear discovery and response process for every inquiry',
      'Every inquiry is recorded for organized follow-up',
      'Division-specific context captured before the team responds',
      'Follow-up routed to the right business line from the start'
    ],
    engagementModels: [
      {
        title: 'Parent company and partnership conversations',
        copy: 'Best for introductions, partnerships, company-level opportunities, or questions about the Kuwexa organization.'
      },
      {
        title: 'Division discovery and redirection',
        copy: 'Useful when you know the brand but need help reaching the correct division such as CodexWEBZ, Kuwexa Lifestyle, or Kuwexa B2B.'
      },
      {
        title: 'B2B product enquiries',
        copy: 'Use the dedicated B2B page for product-specific requests, especially when selecting multiple products in one enquiry.'
      }
    ],
    contactCards: [
      {
        title: 'Reach the right division',
        copy: 'Start here if you need help choosing between CodexWEBZ, Kuwexa Lifestyle, or the B2B catalog.'
      },
      {
        title: 'Discuss the company',
        copy: 'Useful for parent company conversations, partnerships, introductions, and high-level business opportunities.'
      },
      {
        title: 'Share a detailed requirement',
        copy: 'Every message is captured with context so the team can respond with continuity.'
      }
    ],
    conversationAreas: [
      {
        title: 'Parent company direction',
        copy: 'Use this route when the conversation is about Kuwexa as an organization, long-term collaboration, or business-level introductions.'
      },
      {
        title: 'Trade and B2B product discovery',
        copy: 'This is the right path for wholesale requirements, category-level questions, sourcing conversations, or product-linked enquiries.'
      },
      {
        title: 'Digital growth and CodexWEBZ',
        copy: 'Use this path for company websites, digital experiences, automation, and broader technology support.'
      }
    ],
    supportPrinciples: [
      'Operational discipline from the first inquiry',
      'Documented follow-up and clear routing',
      'Predictable communication across the right division'
    ],
    responseSteps: [
      {
        step: '01',
        title: 'Inquiry review',
        copy: 'The request is reviewed so the conversation starts with context and clarity.'
      },
      {
        step: '02',
        title: 'Division alignment',
        copy: 'The team identifies whether the request belongs to the parent company, CodexWEBZ, Kuwexa Lifestyle, or the B2B flow.'
      },
      {
        step: '03',
        title: 'Recommended next step',
        copy: 'A clear response path is shared so the conversation moves to the right team or division.'
      }
    ],
    checklist: [
      'Which division or topic your message is about',
      'Your company name and role',
      'What outcome or discussion you are looking for',
      'Any timeline, quantity, or urgency details',
      'Whether this is a general inquiry or a product-specific B2B request'
    ],
    faqs: [
      {
        question: 'What should be included in the inquiry?',
        answer: 'Share the division you are interested in, the business context, what outcome you want, and any timeline or quantity details that matter.'
      },
      {
        question: 'Where should product-specific wholesale enquiries go?',
        answer: 'Use the B2B page so you can choose one or more products directly from the catalog and send a product-linked enquiry.'
      }
    ]
  };
}

function getAboutPageContent() {
  return {
    eyebrow: 'About Kuwexa',
    title: 'A parent company where commerce, trade, and technology move with purpose.',
    intro: 'Kuwexa Private Limited works across global ecommerce, B2B import-export, and technology enablement with a model built to reduce chaos and improve long-term business performance.',
    overview: 'Through Kuwexa.com, the company builds consumer lifestyle commerce. Through CodexWEBZ, it supports organizations with websites and digital capability. Through Kuwexa B2B, it presents wholesale products through a structured company catalog.',
    summary: 'That combination makes Kuwexa more than a marketing brand. It is an operating organization connecting trade capability, consumer commerce, and digital execution.',
    highlights: [
      {
        title: 'Hybrid operating model',
        copy: 'Kuwexa combines physical supply-chain understanding with digital capability, which gives the company a more practical business foundation.'
      },
      {
        title: 'Clear division structure',
        copy: 'The parent website explains the organization clearly while allowing each division to grow through a more focused public destination.'
      },
      {
        title: 'Ethics and execution together',
        copy: 'The business is shaped around disciplined delivery, documented outcomes, and more predictable performance rather than vague promises.'
      }
    ],
    identityCards: [
      {
        title: 'Global ecommerce',
        copy: 'Kuwexa helps businesses access wider markets and expand their reach across digital and global trade environments.'
      },
      {
        title: 'B2B import-export',
        copy: 'The company understands supply-side conversations, product-led buying behavior, and the need for clearer trade communication.'
      },
      {
        title: 'Technology enablement',
        copy: 'CodexWEBZ supports organizations with websites, digital capability, automation, and dependable delivery.'
      }
    ],
    narrative: [
      'Kuwexa Private Limited is a hybrid company working across global ecommerce, B2B import-export, and technology enablement.',
      'By combining trade capability with digital execution, the company helps businesses operate with more clarity, stronger connectivity, and better long-term sustainability.',
      'The website now reflects that structure more clearly by presenting Kuwexa as the parent company, then guiding visitors into the right division experience.'
    ],
    vision: 'To build a globally trusted organization where commerce and technology work together to empower businesses and support sustainable success across markets.',
    visionPoints: [
      'Build trust across both trade and digital relationships.',
      'Create a business model where physical and digital execution reinforce one another.',
      'Support sustainable performance through repeatable discipline and long-term clarity.'
    ],
    mission: 'To support businesses with dependable trade solutions, stronger digital presence, and practical execution that enables steady growth.',
    focusAreas: [
      'Global ecommerce reach and market access',
      'Consumer lifestyle commerce through Kuwexa.com',
      'Technology enablement through CodexWEBZ',
      'Wholesale product discovery and enquiry through Kuwexa B2B'
    ],
    serviceGroups: [
      'Global Ecommerce',
      'B2B Import-Export',
      'CodexWEBZ',
      'Kuwexa Lifestyle',
      'Kuwexa B2B',
      'Delivery With Ethics',
      'Digital Capability'
    ],
    principles: [
      {
        title: 'Delivery with ethics',
        copy: 'Kuwexa aims to be a trusted partner by connecting ambition with repeatable performance rather than short-term optics.'
      },
      {
        title: 'Substance over shortcuts',
        copy: 'Technology, supply-side coordination, and public communication are treated with long-term seriousness, not quick fixes.'
      },
      {
        title: 'Predictable performance',
        copy: 'The company values documented outcomes, steady follow-through, and operational discipline across the organization.'
      }
    ],
    audience: [
      'Visitors learning what Kuwexa is as a company',
      'Partners trying to reach the right division',
      'Businesses exploring trade, consumer, or technology collaboration',
      'Customers evaluating Kuwexa Lifestyle, B2B supply, or CodexWEBZ'
    ],
    approach: [
      {
        title: 'Understand the operating reality',
        copy: 'Start from the actual business model, market need, supply challenge, or digital requirement involved.'
      },
      {
        title: 'Build the right business route',
        copy: 'Direct people toward the right mix of trade support, consumer presentation, or digital capability instead of forcing everything into one generic message.'
      },
      {
        title: 'Document and deliver',
        copy: 'Give every public and internal touchpoint more structure so the result is dependable, not just visually polished.'
      },
      {
        title: 'Scale with discipline',
        copy: 'Keep the business flexible enough to grow while preserving clearer ownership, communication, and operational continuity.'
      }
    ],
    hybridContrast: {
      industryNorm: [
        'Reactive firefighting',
        'Unstable technology',
        'Opaque supply chains',
        'Vague promises'
      ],
      kuwexaWay: [
        'Operational discipline',
        'Substance over shortcuts',
        'Documented outcomes',
        'Predictable performance'
      ],
      closingQuote: 'Trade awareness, digital clarity, and disciplined execution move together at Kuwexa.'
    },
    ethos: {
      title: 'Our ethos',
      quote: 'Delivery with ethics',
      copy: 'The Kuwexa position is simple: credibility should come from steady business performance, clearer communication, and dependable delivery rather than noise.',
      points: [
        'Trusted partnership built on clarity and continuity',
        'Business ambition turned into more repeatable performance',
        'Technology and commerce aligned to real operational use'
      ]
    },
    ecosystemMap: [
      {
        label: 'Parent Company',
        title: 'Kuwexa Private Limited',
        copy: 'The company layer that explains the structure, holds the narrative together, and directs visitors to the right business line.'
      },
      {
        label: 'Consumer Lifestyle (B2C)',
        title: 'Kuwexa Lifestyle',
        copy: 'Curated lifestyle goods, fashion, home essentials, and consumer accessories shaped for modern digital commerce.'
      },
      {
        label: 'Business Supply (B2B)',
        title: 'Kuwexa B2B',
        copy: 'Structured product discovery and trade-friendly enquiries for wholesale categories like dry fruits, spices, woollens, and grains.'
      },
      {
        label: 'Digital Innovation',
        title: 'CodexWEBZ',
        copy: 'Websites, digital experiences, and dependable delivery that improve visibility and customer confidence.'
      }
    ],
    advantages: [
      'A business story grounded in both trade and digital execution',
      'Three clearer divisions with more useful public roles',
      'Dedicated destinations where needed for CodexWEBZ and Kuwexa Lifestyle',
      'A wholesale catalog that stays naturally connected to the main company website'
    ],
    closing: "Kuwexa's strength is not only that it builds websites or presents products. It is that the company understands both the physical and digital sides of growth and uses that to create a clearer, more dependable organization."
  };
}

function getTeamPageContent(teamShowcase = { leadership: [], employees: [] }) {
  return {
    eyebrow: 'Leadership',
    title: 'Leadership, specialists, and delivery roles behind Kuwexa.',
    intro: 'Kuwexa is guided by leadership responsible for the parent company and the divisions operating beneath it.',
    values: [
      {
        title: 'Delivery with ethics',
        copy: 'The team is expected to turn strategy into dependable outcomes without hiding behind vague promises.'
      },
      {
        title: 'Documented outcomes',
        copy: 'Leadership and delivery roles work toward clearer ownership, stronger continuity, and more visible execution quality.'
      },
      {
        title: 'Predictable performance',
        copy: 'The aim is to make growth more stable by combining discipline, communication, and better coordination across the business.'
      }
    ],
    operatingBeliefs: [
      'Operational discipline',
      'Substance over shortcuts',
      'Clarity across divisions',
      'Repeatable business performance'
    ],
    ethosQuote: 'Turning ambition into repeatable business performance.',
    metrics: [
      { label: 'Leadership Profiles', value: String(teamShowcase.leadership?.length || 0) },
      { label: 'Employee Profiles', value: String(teamShowcase.employees?.length || 0) },
      { label: 'Core Pillars', value: '3' }
    ]
  };
}

function getDivisionDirectory() {
  return divisionDirectory.map((division) => ({
    ...division,
    marketFocus: [...(division.marketFocus || [])],
    primaryPoints: [...division.primaryPoints],
    operatingModel: [...division.operatingModel],
    signatureAreas: [...(division.signatureAreas || [])],
    journeySteps: (division.journeySteps || []).map((item) => ({ ...item })),
    experiencePillars: (division.experiencePillars || []).map((item) => ({ ...item })),
    highlightStats: (division.highlightStats || []).map((item) => ({ ...item })),
    audiences: [...division.audiences]
  }));
}

function getDivisionBySlug(slug) {
  const match = divisionDirectory.find((division) => division.slug === slug);
  if (!match) {
    return null;
  }

  return {
    ...match,
    marketFocus: [...(match.marketFocus || [])],
    primaryPoints: [...match.primaryPoints],
    operatingModel: [...match.operatingModel],
    signatureAreas: [...(match.signatureAreas || [])],
    journeySteps: (match.journeySteps || []).map((item) => ({ ...item })),
    experiencePillars: (match.experiencePillars || []).map((item) => ({ ...item })),
    highlightStats: (match.highlightStats || []).map((item) => ({ ...item })),
    audiences: [...match.audiences]
  };
}

function getB2BPageContent({ categories = [], products = [] } = {}) {
  return {
    categories,
    productCountLabel: `${products.length} product${products.length === 1 ? '' : 's'} currently listed`,
    tradeNarrative: [
      'Kuwexa B2B sits inside a hybrid parent company that understands both supply-side reality and digital presentation.',
      'The result is a public catalog built for clearer wholesale discovery, better product context, and a more confident first conversation.'
    ],
    categoryExamples: [
      'Dry Fruits',
      'Spices',
      'Woollen Products',
      'Cereals / Grains'
    ],
    introCards: [
      {
        title: 'Category menu',
        copy: 'Each category shown on the public page is presented clearly so buyers can move quickly into the right product family.'
      },
      {
        title: 'Product-first discovery',
        copy: 'Every product can carry highlights, images, minimum order details, brochure links, and its own detail page inside the B2B catalog.'
      },
      {
        title: 'Multi-product enquiries',
        copy: 'Buyers can choose multiple products in one form submission, making the enquiry flow more practical for wholesale discussions.'
      }
    ],
    buyerCommitments: [
      {
        title: 'Trade-friendly discovery',
        copy: 'Categories help buyers move directly into the relevant product family instead of navigating a generic catalog.'
      },
      {
        title: 'More usable product detail',
        copy: 'Product pages can include highlights, multiple images, MOQ guidance, brochure links, and clearer tags before contact is made.'
      },
      {
        title: 'Cleaner sales context',
        copy: 'The enquiry form keeps selected products together so the conversation starts with the right business context.'
      }
    ],
    buyerSteps: [
      {
        step: '01',
        title: 'Browse by category',
        copy: 'Use the category menu to move directly to the relevant product group.'
      },
      {
        step: '02',
        title: 'Open product details',
        copy: 'Review product highlights, images, and minimum order information before making contact.'
      },
      {
        step: '03',
        title: 'Select multiple products',
        copy: 'Choose one or more products in the enquiry form instead of sending separate requests.'
      }
    ],
    checklist: [
      'Company name and buyer contact details',
      'One or more selected products',
      'Required quantity, MOQ, or packaging notes',
      'Target market, country, or delivery preference',
      'Any brochure, pricing, or product detail questions'
    ],
    adminNotes: [
      'Categories can represent dry fruits, spices, woollen products, cereals, grains, and other wholesale lines.',
      'Each product can carry rich description, highlights, MOQ details, tags, and multiple supporting images.',
      'Published categories and products appear across the B2B catalog and product detail pages.'
    ],
    supplyPrinciples: [
      'Supply-side clarity with digital presentation',
      'Multiple product selection in one enquiry',
      'Wholesale categories kept clear and current',
      'Detailed product pages for serious buyer review'
    ],
    faqs: [
      {
        question: 'Can one enquiry include multiple products?',
        answer: 'Yes. The B2B enquiry form is built specifically so buyers can choose multiple products in one submission.'
      },
      {
        question: 'Who controls the product categories and listings?',
        answer: 'The Kuwexa team maintains the product categories and listings so the catalog stays accurate, organized, and ready for wholesale buyers.'
      },
      {
        question: 'Can the B2B page show separate product details?',
        answer: 'Yes. Every published product can have its own detail page with images, highlights, and supporting links.'
      }
    ]
  };
}

module.exports = {
  excerpt,
  stripHtml,
  resolveServiceProfile,
  getHomeContent,
  getDivisionDirectory,
  getDivisionBySlug,
  getB2BPageContent,
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
