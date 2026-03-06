const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userModel = require('../models/userModel');

function readToken(req) {
  const bearer = req.get('authorization');
  if (bearer && bearer.startsWith('Bearer ')) {
    return bearer.slice(7);
  }

  return req.cookies?.codexwebz_token || null;
}

async function hydrateUser(req, res, next) {
  const token = readToken(req);
  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await userModel.findById(payload.id);
    if (!user || user.status !== 'active') {
      res.clearCookie('codexwebz_token');
      return next();
    }

    req.user = user;
    res.locals.currentUser = user;
    return next();
  } catch (error) {
    res.clearCookie('codexwebz_token');
    return next();
  }
}

function requireAuth(req, res, next) {
  if (req.user) {
    return next();
  }

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  return res.redirect('/login');
}

function ensureGuest(req, res, next) {
  if (req.user) {
    return res.redirect(req.user.role_name === 'super_admin' ? '/admin/dashboard' : '/manager/dashboard');
  }

  return next();
}

module.exports = {
  hydrateUser,
  requireAuth,
  ensureGuest
};
