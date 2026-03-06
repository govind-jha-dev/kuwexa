const { getOne, query } = require('../config/database');

async function getOverview() {
  const [visitors, leads, blogPosts, projects, applications, users] = await Promise.all([
    getOne('SELECT COUNT(*) AS total FROM visitor_logs'),
    getOne('SELECT COUNT(*) AS total FROM leads'),
    getOne('SELECT COUNT(*) AS total FROM blog_posts'),
    getOne('SELECT COUNT(*) AS total FROM projects'),
    getOne('SELECT COUNT(*) AS total FROM applications'),
    getOne('SELECT COUNT(*) AS total FROM users')
  ]);

  return {
    visitors: visitors?.total || 0,
    leads: leads?.total || 0,
    blogPosts: blogPosts?.total || 0,
    projects: projects?.total || 0,
    applications: applications?.total || 0,
    users: users?.total || 0
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

async function getOperationalCounts() {
  const [newLeads, activeProjects, publishedPosts, pendingApplications] = await Promise.all([
    getOne("SELECT COUNT(*) AS total FROM leads WHERE status = 'new'"),
    getOne("SELECT COUNT(*) AS total FROM projects WHERE status = 'published'"),
    getOne("SELECT COUNT(*) AS total FROM blog_posts WHERE status = 'published'"),
    getOne("SELECT COUNT(*) AS total FROM applications WHERE status IN ('new', 'reviewed', 'interview_scheduled')")
  ]);

  return {
    newLeads: newLeads?.total || 0,
    activeProjects: activeProjects?.total || 0,
    publishedPosts: publishedPosts?.total || 0,
    pendingApplications: pendingApplications?.total || 0
  };
}

module.exports = {
  getOverview,
  getTrafficSeries,
  getTopPages,
  getOperationalCounts
};
