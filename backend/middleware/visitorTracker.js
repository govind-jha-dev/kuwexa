const { execute } = require('../config/database');

async function visitorTracker(req, res, next) {
  const isPublicGet = req.method === 'GET' &&
    !req.path.startsWith('/admin') &&
    !req.path.startsWith('/manager') &&
    !req.path.startsWith('/api') &&
    !req.path.startsWith('/uploads') &&
    !req.path.startsWith('/styles') &&
    !req.path.startsWith('/login') &&
    !req.path.startsWith('/favicon');

  if (isPublicGet) {
    execute(
      `
        INSERT INTO visitor_logs (path, ip_address, user_agent, referrer)
        VALUES (?, ?, ?, ?)
      `,
      [
        req.path,
        req.ip,
        req.get('user-agent') || null,
        req.get('referer') || null
      ]
    ).catch(() => {});
  }

  next();
}

module.exports = visitorTracker;
