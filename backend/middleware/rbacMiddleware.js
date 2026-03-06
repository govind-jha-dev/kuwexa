const { hasPermission } = require('../config/permissions');

function authorize(...permissions) {
  return function authorizationMiddleware(req, res, next) {
    const allowed = permissions.every((permission) => hasPermission(req.user, permission));
    if (allowed) {
      return next();
    }

    if (req.originalUrl.startsWith('/api/')) {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }

    return res.status(403).render('frontend/pages/error', {
      title: 'Forbidden',
      message: 'You do not have access to this area.',
      seo: {
        metaTitle: 'Forbidden',
        metaDescription: 'Access denied.'
      }
    });
  };
}

module.exports = {
  authorize
};
