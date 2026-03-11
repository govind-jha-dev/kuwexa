const analyticsModel = require('../models/analyticsModel');
const leadModel = require('../models/leadModel');
const applicationModel = require('../models/applicationModel');
const projectModel = require('../models/projectModel');
const blogModel = require('../models/blogModel');
const { buildDashboardMenu, formatDate, formatDateTime, titleCase } = require('../utils/view');

function getDashboardBasePath(req) {
  return req.baseUrl.startsWith('/admin') ? '/admin' : '/manager';
}

function getAreaLabel(req) {
  return req.baseUrl.startsWith('/admin') ? 'Admin' : 'Manager';
}

function getNotice(req) {
  if (req.query.success) {
    return {
      type: 'success',
      message: req.query.success
    };
  }

  if (req.query.error) {
    return {
      type: 'error',
      message: req.query.error
    };
  }

  return null;
}

function buildDashboardViewModel(req, options = {}) {
  const basePath = getDashboardBasePath(req);
  const defaultNotice = getNotice(req);

  return {
    areaLabel: getAreaLabel(req),
    basePath,
    menu: buildDashboardMenu(req.user, basePath),
    currentUser: req.user || null,
    activeMenu: 'Dashboard',
    pageTitle: 'Dashboard',
    notice: defaultNotice,
    stats: [],
    form: null,
    infoPanel: null,
    table: null,
    secondaryTable: null,
    cards: [],
    latestLeads: [],
    latestApplications: [],
    featuredProjects: [],
    latestPosts: [],
    trafficSeries: [],
    topLocations: [],
    recentVisitors: [],
    visitorJourneys: [],
    blockedVisitors: [],
    overview: {
      visitors: 0,
      uniqueVisitors: 0,
      leads: 0,
      applications: 0,
      products: 0,
      blockedVisitors: 0
    },
    topPages: [],
    helpers: {
      formatDate,
      formatDateTime,
      titleCase
    },
    ...options
  };
}

async function renderHome(req, res) {
  const [overview, operationalCounts, latestLeads, latestApplications, featuredProjects, latestPosts, trafficSeries] = await Promise.all([
    analyticsModel.getOverview(),
    analyticsModel.getOperationalCounts(),
    leadModel.latest(5),
    applicationModel.latest(5),
    projectModel.listFeatured(5),
    blogModel.latest(5),
    analyticsModel.getTrafficSeries(7)
  ]);

  const cards = req.baseUrl.startsWith('/admin')
    ? [
        { label: 'Website Visitors', value: overview.visitors },
        { label: 'Total Leads', value: overview.leads },
        { label: 'Products', value: overview.products },
        { label: 'Blog Posts', value: overview.blogPosts },
        { label: 'Projects', value: overview.projects },
        { label: 'Job Applications', value: overview.applications },
        { label: 'System Users', value: overview.users }
      ]
    : [
        { label: 'New Leads', value: operationalCounts.newLeads },
        { label: 'Active Projects', value: operationalCounts.activeProjects },
        { label: 'Published Products', value: operationalCounts.publishedProducts },
        { label: 'Published Posts', value: operationalCounts.publishedPosts },
        { label: 'Pending Applications', value: operationalCounts.pendingApplications },
        { label: 'Traffic Events', value: overview.visitors }
      ];

  return res.render('dashboard/components/dashboard-home', buildDashboardViewModel(req, {
    pageTitle: `${getAreaLabel(req)} Dashboard`,
    activeMenu: 'Dashboard',
    cards,
    latestLeads,
    latestApplications,
    featuredProjects,
    latestPosts,
    trafficSeries
  }));
}

function renderModule(req, res, options) {
  return res.render('dashboard/components/module-page', buildDashboardViewModel(req, options));
}

function renderAnalytics(req, res, options) {
  return res.render('dashboard/components/analytics-page', buildDashboardViewModel(req, options));
}

module.exports = {
  getDashboardBasePath,
  buildDashboardViewModel,
  renderHome,
  renderModule,
  renderAnalytics
};
