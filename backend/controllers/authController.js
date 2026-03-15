const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const seoModel = require('../models/seoModel');
const env = require('../config/env');

function getLoginSeo(seoRecord) {
  return {
    metaTitle: seoRecord?.meta_title || 'Login | CodexWebz',
    metaDescription: seoRecord?.meta_description || 'Sign in to the CodexWebz management platform.',
    metaKeywords: seoRecord?.meta_keywords || null,
    metaRobots: seoRecord?.meta_robots || 'noindex, nofollow',
    ogType: seoRecord?.og_type || 'website',
    ogTitle: seoRecord?.og_title || seoRecord?.meta_title || 'Login | CodexWebz',
    ogDescription: seoRecord?.og_description || seoRecord?.meta_description || 'Sign in to the CodexWebz management platform.',
    ogImage: seoRecord?.og_image || null,
    ogImageAlt: seoRecord?.og_image_alt || null,
    twitterCard: seoRecord?.twitter_card || null,
    twitterTitle: seoRecord?.twitter_title || null,
    twitterDescription: seoRecord?.twitter_description || null,
    twitterImage: seoRecord?.twitter_image || null,
    canonicalUrl: seoRecord?.canonical_url || env.privateLoginPath,
    schemaMarkup: seoRecord?.schema_markup || null
  };
}

async function showLogin(req, res) {
  const seoRecord = await seoModel.findByPageKey('login');

  return res.render('frontend/pages/login', {
    title: 'Login',
    error: req.query.error || null,
    seo: getLoginSeo(seoRecord),
    loginPath: env.privateLoginPath
  });
}

function signToken(user) {
  return jwt.sign({ id: user.id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

function setAuthCookie(res, token) {
  res.cookie('codexwebz_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction
  });
}

async function login(req, res) {
  const user = await userModel.findByEmail(req.body.email);
  if (!user || user.status !== 'active') {
    const message = 'Invalid credentials.';
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({ message });
    }

    return res.redirect(`${env.privateLoginPath}?error=${encodeURIComponent(message)}`);
  }

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) {
    const message = 'Invalid credentials.';
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({ message });
    }

    return res.redirect(`${env.privateLoginPath}?error=${encodeURIComponent(message)}`);
  }

  await userModel.updateUser(user.id, {
    last_login_at: new Date()
  });

  const token = signToken(user);
  setAuthCookie(res, token);

  if (req.originalUrl.startsWith('/api/')) {
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name,
        permissions: user.permissions
      }
    });
  }

  const redirectPath = user.role_name === 'super_admin' ? '/admin/dashboard' : '/manager/dashboard';
  return res.redirect(redirectPath);
}

function logout(req, res) {
  res.clearCookie('codexwebz_token');

  if (req.originalUrl.startsWith('/api/')) {
    return res.json({ message: 'Logged out successfully.' });
  }

  return res.redirect(env.privateLoginPath);
}

function me(req, res) {
  return res.json({
    user: req.user
      ? {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role_name,
          permissions: req.user.permissions
        }
      : null
  });
}

module.exports = {
  showLogin,
  login,
  logout,
  me
};
