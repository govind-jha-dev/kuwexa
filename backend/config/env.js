const path = require('path');
require('dotenv').config();

const rootDir = path.join(__dirname, '..', '..');
const privateLoginPath = String(process.env.PRIVATE_LOGIN_PATH || '/access/codexwebz-control-room-7f3b91d24c6e8a5').trim();
const trustProxyValue = typeof process.env.TRUST_PROXY === 'string' ? process.env.TRUST_PROXY.trim() : '';

function parseTrustProxy(value, isProduction) {
  if (!value) {
    return isProduction ? 1 : false;
  }

  const normalizedValue = value.toLowerCase();

  if (normalizedValue === 'true') {
    return true;
  }

  if (normalizedValue === 'false') {
    return false;
  }

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  if (value.includes(',')) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return value;
}

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

module.exports = {
  rootDir,
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT || 4000),
  appUrl: process.env.APP_URL || 'http://localhost:4000',
  jwtSecret: process.env.JWT_SECRET || 'change_this_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieSecret: process.env.COOKIE_SECRET || 'change_this_cookie_secret',
  csrfSecret: process.env.CSRF_SECRET || 'change_this_csrf_secret',
  privateLoginPath: privateLoginPath.startsWith('/') ? privateLoginPath : `/${privateLoginPath}`,
  trustProxy: parseTrustProxy(trustProxyValue, isProduction),
  uploadDir: path.join(rootDir, process.env.UPLOAD_DIR || 'uploads'),
  maxFileSizeBytes: Number(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024,
  dbConnectTimeoutMs: Number(process.env.DB_CONNECT_TIMEOUT_MS || 5000),
  dbBootstrapLockTimeoutSeconds: Number(process.env.DB_BOOTSTRAP_LOCK_TIMEOUT_SECONDS || 20),
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'codexwebz'
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: String(process.env.MAIL_SECURE || 'false') === 'true',
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM || (process.env.MAIL_USER ? `Kuwexa <${process.env.MAIL_USER}>` : 'Kuwexa <no-reply@kuwexa.com>'),
    replyTo: process.env.MAIL_REPLY_TO || process.env.MAIL_USER || null,
    alertEmail: process.env.ALERT_EMAIL || process.env.MAIL_USER || 'hello@kuwexa.com'
  }
};
