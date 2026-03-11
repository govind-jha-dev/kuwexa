const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const managerRoutes = require('./routes/managerRoutes');
const apiRoutes = require('./routes/apiRoutes');
const env = require('./config/env');
const settingsModel = require('./models/settingsModel');
const teamModel = require('./models/teamModel');
const { hydrateUser } = require('./middleware/authMiddleware');
const { issueCsrfToken, validateCsrf } = require('./middleware/csrfMiddleware');
const { generalLimiter } = require('./middleware/rateLimiters');
const blockedVisitorGuard = require('./middleware/blockedVisitorGuard');
const visitorTracker = require('./middleware/visitorTracker');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.set('view engine', 'ejs');
app.set('views', env.rootDir);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://cdn.jsdelivr.net', 'https://www.googletagmanager.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https:', 'https://cdn.jsdelivr.net', 'https://www.google-analytics.com'],
      frameSrc: ["'self'", 'https:']
    }
  }
}));

app.use(compression());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));
app.use(generalLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(env.cookieSecret));
app.use('/styles', express.static(path.join(env.rootDir, 'frontend', 'styles')));
app.use('/scripts', express.static(path.join(env.rootDir, 'frontend', 'scripts')));
app.use('/uploads', express.static(env.uploadDir));
app.use(hydrateUser);
app.use(async (req, res, next) => {
  res.locals.currentUser = req.user || null;

  try {
    res.locals.siteSettings = await settingsModel.getSettings();
  } catch (error) {
    res.locals.siteSettings = null;
  }

  res.locals.currentPath = req.path;
  res.locals.currentYear = new Date().getFullYear();
  res.locals.appUrl = env.appUrl;

  if (req.path.startsWith('/api') || req.path.startsWith('/admin') || req.path.startsWith('/manager') || req.path.endsWith('.xml') || req.path.endsWith('.txt')) {
    res.locals.teamShowcase = { leadership: [], employees: [] };
    return next();
  }

  try {
    res.locals.teamShowcase = await teamModel.listGroupedActive();
  } catch (error) {
    res.locals.teamShowcase = { leadership: [], employees: [] };
  }

  next();
});
app.use(blockedVisitorGuard);
app.use(issueCsrfToken);
app.use(validateCsrf);
app.use(visitorTracker);

app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/manager', managerRoutes);
app.use('/', publicRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
