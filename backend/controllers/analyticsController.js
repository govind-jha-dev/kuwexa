const analyticsModel = require('../models/analyticsModel');
const { renderAnalytics } = require('./dashboardController');

async function renderAnalyticsPage(req, res) {
  const [overview, trafficSeries, topPages] = await Promise.all([
    analyticsModel.getOverview(),
    analyticsModel.getTrafficSeries(14),
    analyticsModel.getTopPages(10)
  ]);

  return renderAnalytics(req, res, {
    pageTitle: 'Analytics',
    activeMenu: 'Analytics',
    overview,
    trafficSeries,
    topPages
  });
}

async function apiOverview(req, res) {
  const [overview, trafficSeries, topPages] = await Promise.all([
    analyticsModel.getOverview(),
    analyticsModel.getTrafficSeries(14),
    analyticsModel.getTopPages(10)
  ]);

  return res.json({ overview, trafficSeries, topPages });
}

module.exports = {
  renderAnalyticsPage,
  apiOverview
};
