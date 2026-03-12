const analyticsModel = require('../models/analyticsModel');
const blockedVisitorModel = require('../models/blockedVisitorModel');
const { renderAnalytics, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText } = require('../utils/content');

async function getAnalyticsPayload() {
  const [overview, trafficSeries, topPages, topLocations, recentVisitors, visitorJourneys, blockedVisitors] = await Promise.all([
    analyticsModel.getOverview(),
    analyticsModel.getTrafficSeries(14),
    analyticsModel.getTopPages(10),
    analyticsModel.getTopLocations(8),
    analyticsModel.getRecentVisitors(25),
    analyticsModel.getVisitorJourneys(12, 12),
    analyticsModel.getBlockedVisitors()
  ]);

  return {
    overview,
    trafficSeries,
    topPages,
    topLocations,
    recentVisitors,
    visitorJourneys,
    blockedVisitors
  };
}

async function renderAnalyticsPage(req, res) {
  const payload = await getAnalyticsPayload();

  return renderAnalytics(req, res, {
    pageTitle: 'Analytics',
    activeMenu: 'Analytics',
    ...payload
  });
}

async function blockVisitor(req, res) {
  const ipAddress = sanitizePlainText(req.body.ip_address);
  if (!ipAddress) {
    const error = new Error('Visitor IP address is required.');
    error.statusCode = 422;
    throw error;
  }

  const blockedVisitor = await blockedVisitorModel.createOrUpdate({
    ip_address: ipAddress,
    reason: sanitizePlainText(req.body.reason) || 'Blocked by admin from analytics dashboard.',
    created_by: req.user?.id || null
  });

  if (req.originalUrl.startsWith('/api/')) {
    return res.json({ message: 'Visitor blocked successfully.', blockedVisitor });
  }

  return res.redirect(`${getDashboardBasePath(req)}/analytics?success=Visitor%20blocked%20successfully.`);
}

async function unblockVisitor(req, res) {
  const ipAddress = sanitizePlainText(req.body.ip_address);
  if (!ipAddress) {
    const error = new Error('Visitor IP address is required.');
    error.statusCode = 422;
    throw error;
  }

  await blockedVisitorModel.deleteByIp(ipAddress);

  if (req.originalUrl.startsWith('/api/')) {
    return res.json({ message: 'Visitor unblocked successfully.' });
  }

  return res.redirect(`${getDashboardBasePath(req)}/analytics?success=Visitor%20unblocked%20successfully.`);
}

async function clearVisitorData(req, res) {
  await analyticsModel.clearVisitorLogs();

  if (req.originalUrl.startsWith('/api/')) {
    return res.json({ message: 'Visitor analytics data cleared successfully.' });
  }

  return res.redirect(`${getDashboardBasePath(req)}/analytics?success=Visitor%20analytics%20data%20cleared%20successfully.`);
}

async function apiOverview(req, res) {
  return res.json(await getAnalyticsPayload());
}

module.exports = {
  renderAnalyticsPage,
  blockVisitor,
  unblockVisitor,
  clearVisitorData,
  apiOverview
};
