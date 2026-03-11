const blockedVisitorModel = require('../models/blockedVisitorModel');
const { getClientIp, isPublicWebsiteRequest } = require('../utils/visitor');

async function blockedVisitorGuard(req, res, next) {
  if (!isPublicWebsiteRequest(req)) {
    return next();
  }

  const ipAddress = getClientIp(req);
  if (!ipAddress) {
    return next();
  }

  const blockedVisitor = await blockedVisitorModel.findByIp(ipAddress);
  if (!blockedVisitor) {
    return next();
  }

  const message = 'Access to this website is not available for your network.';

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(403).json({ message });
  }

  return res.status(403).render('frontend/pages/error', {
    title: 'Access restricted',
    message,
    seo: {
      metaTitle: 'Access Restricted',
      metaDescription: message
    }
  });
}

module.exports = blockedVisitorGuard;
