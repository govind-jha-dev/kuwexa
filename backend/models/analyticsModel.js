const { getOne, query, execute } = require('../config/database');
const blockedVisitorModel = require('./blockedVisitorModel');

async function getOverview() {
  const [visitors, uniqueVisitors, leads, blogPosts, projects, products, applications, users, blockedVisitors] = await Promise.all([
    getOne('SELECT COUNT(*) AS total FROM visitor_logs'),
    getOne("SELECT COUNT(DISTINCT ip_address) AS total FROM visitor_logs WHERE ip_address IS NOT NULL AND ip_address <> ''"),
    getOne('SELECT COUNT(*) AS total FROM leads'),
    getOne('SELECT COUNT(*) AS total FROM blog_posts'),
    getOne('SELECT COUNT(*) AS total FROM projects'),
    getOne('SELECT COUNT(*) AS total FROM products'),
    getOne('SELECT COUNT(*) AS total FROM applications'),
    getOne('SELECT COUNT(*) AS total FROM users'),
    getOne('SELECT COUNT(*) AS total FROM blocked_visitors')
  ]);

  return {
    visitors: visitors?.total || 0,
    uniqueVisitors: uniqueVisitors?.total || 0,
    leads: leads?.total || 0,
    blogPosts: blogPosts?.total || 0,
    projects: projects?.total || 0,
    products: products?.total || 0,
    applications: applications?.total || 0,
    users: users?.total || 0,
    blockedVisitors: blockedVisitors?.total || 0
  };
}

async function getTrafficSeries(days = 7) {
  return query(
    `
      SELECT DATE(visited_at) AS day, COUNT(*) AS visits
      FROM visitor_logs
      WHERE visited_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(visited_at)
      ORDER BY day ASC
    `,
    [Number(days)]
  );
}

async function getTopPages(limit = 5) {
  return query(
    `
      SELECT path, COUNT(*) AS visits
      FROM visitor_logs
      GROUP BY path
      ORDER BY visits DESC
      LIMIT ?
    `,
    [Number(limit)]
  );
}

async function getTopLocations(limit = 8) {
  return query(
    `
      SELECT
        COALESCE(NULLIF(country_name, ''), NULLIF(country_code, ''), 'Unknown') AS location,
        COUNT(*) AS visits
      FROM visitor_logs
      GROUP BY location
      ORDER BY visits DESC
      LIMIT ?
    `,
    [Number(limit)]
  );
}

async function getRecentVisitors(limit = 25) {
  return query(
    `
      SELECT
        visitor_logs.*,
        CASE WHEN blocked_visitors.ip_address IS NULL THEN 0 ELSE 1 END AS is_blocked
      FROM visitor_logs
      LEFT JOIN blocked_visitors ON blocked_visitors.ip_address = visitor_logs.ip_address
      ORDER BY visitor_logs.visited_at DESC
      LIMIT ?
    `,
    [Number(limit)]
  );
}

async function getVisitorJourneys(limitVisitors = 12, limitEventsPerVisitor = 12) {
  const visitors = await query(
    `
      SELECT
        visitor_logs.ip_address,
        MAX(visitor_logs.country_code) AS country_code,
        MAX(visitor_logs.country_name) AS country_name,
        MAX(visitor_logs.city) AS city,
        MAX(visitor_logs.user_agent) AS user_agent,
        MAX(visitor_logs.referrer) AS referrer,
        MIN(visitor_logs.visited_at) AS first_seen,
        MAX(visitor_logs.visited_at) AS last_seen,
        COUNT(*) AS total_hits,
        MAX(CASE WHEN blocked_visitors.ip_address IS NULL THEN 0 ELSE 1 END) AS is_blocked
      FROM visitor_logs
      LEFT JOIN blocked_visitors ON blocked_visitors.ip_address = visitor_logs.ip_address
      WHERE visitor_logs.ip_address IS NOT NULL
        AND visitor_logs.ip_address <> ''
      GROUP BY visitor_logs.ip_address
      ORDER BY last_seen DESC
      LIMIT ?
    `,
    [Number(limitVisitors)]
  );

  return Promise.all(
    visitors.map(async (visitor) => {
      const pageHistory = await query(
        `
          SELECT path, visited_at
          FROM visitor_logs
          WHERE ip_address <=> ?
          ORDER BY visited_at DESC
          LIMIT ?
        `,
        [visitor.ip_address, Number(limitEventsPerVisitor)]
      );

      const uniquePaths = [...new Set(pageHistory.map((item) => item.path).filter(Boolean))];

      return {
        ...visitor,
        unique_paths: uniquePaths,
        pageHistory
      };
    })
  );
}

async function getBlockedVisitors() {
  return blockedVisitorModel.listAll();
}

async function getOperationalCounts() {
  const [newLeads, activeProjects, publishedProducts, publishedPosts, pendingApplications] = await Promise.all([
    getOne("SELECT COUNT(*) AS total FROM leads WHERE status = 'new'"),
    getOne("SELECT COUNT(*) AS total FROM projects WHERE status = 'published'"),
    getOne("SELECT COUNT(*) AS total FROM products WHERE status = 'published'"),
    getOne("SELECT COUNT(*) AS total FROM blog_posts WHERE status = 'published'"),
    getOne("SELECT COUNT(*) AS total FROM applications WHERE status IN ('new', 'reviewed', 'interview_scheduled')")
  ]);

  return {
    newLeads: newLeads?.total || 0,
    activeProjects: activeProjects?.total || 0,
    publishedProducts: publishedProducts?.total || 0,
    publishedPosts: publishedPosts?.total || 0,
    pendingApplications: pendingApplications?.total || 0
  };
}

async function clearVisitorLogs() {
  await execute('DELETE FROM visitor_logs');
}

module.exports = {
  getOverview,
  getTrafficSeries,
  getTopPages,
  getTopLocations,
  getRecentVisitors,
  getVisitorJourneys,
  getBlockedVisitors,
  getOperationalCounts,
  clearVisitorLogs
};
