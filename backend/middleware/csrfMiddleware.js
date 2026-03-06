const crypto = require('crypto');
const env = require('../config/env');

function shouldValidateCsrf(req) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return false;
  }

  if (req.originalUrl.startsWith('/api/')) {
    return false;
  }

  if (req.get('authorization')?.startsWith('Bearer ')) {
    return false;
  }

  return true;
}

function isMultipartRequest(req) {
  const contentType = req.get('content-type') || '';
  return contentType.toLowerCase().startsWith('multipart/form-data');
}

function respondInvalidCsrf(req, res) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(403).json({ message: 'Invalid CSRF token.' });
  }

  return res.status(403).render('frontend/pages/error', {
    title: 'Invalid request',
    message: 'Your session token is missing or invalid. Refresh the page and try again.',
    seo: {
      metaTitle: 'Invalid Request',
      metaDescription: 'Security validation failed.'
    }
  });
}

function validateCsrfToken(req, res, next) {
  if (!shouldValidateCsrf(req)) {
    return next();
  }

  const expected = req.signedCookies?.csrf_token;
  const provided = req.body?._csrf || req.query?._csrf || req.get('x-csrf-token');

  if (!expected || !provided || expected !== provided) {
    return respondInvalidCsrf(req, res);
  }

  return next();
}

function issueCsrfToken(req, res, next) {
  let token = req.signedCookies?.csrf_token;

  if (!token) {
    token = crypto
      .createHmac('sha256', env.csrfSecret)
      .update(crypto.randomUUID())
      .digest('hex');

    res.cookie('csrf_token', token, {
      httpOnly: false,
      sameSite: 'lax',
      secure: env.isProduction,
      signed: true
    });
  }

  res.locals.csrfToken = token;
  next();
}

function validateCsrf(req, res, next) {
  if (!shouldValidateCsrf(req)) {
    return next();
  }

  if (isMultipartRequest(req)) {
    return next();
  }

  return validateCsrfToken(req, res, next);
}

module.exports = {
  issueCsrfToken,
  validateCsrf,
  validateCsrfToken
};
