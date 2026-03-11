const { execute } = require('../config/database');
const { getClientIp, getGeoFromHeaders, isPublicWebsiteRequest } = require('../utils/visitor');

async function visitorTracker(req, res, next) {
  const isPublicGet = req.method === 'GET' && isPublicWebsiteRequest(req);

  if (isPublicGet) {
    const geo = getGeoFromHeaders(req);
    execute(
      `
        INSERT INTO visitor_logs (
          path, ip_address, request_method, user_agent, referrer, country_code, country_name, city
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        req.path,
        getClientIp(req),
        req.method,
        req.get('user-agent') || null,
        req.get('referer') || null,
        geo.countryCode,
        geo.countryName,
        geo.city
      ]
    ).catch(() => {});
  }

  next();
}

module.exports = visitorTracker;
