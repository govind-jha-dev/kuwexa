const sanitizeHtml = require('sanitize-html');
const slugify = require('slugify');

function sanitizePlainText(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const stripped = sanitizeHtml(String(value), {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();

  return stripped || null;
}

function sanitizeRichText(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const clean = sanitizeHtml(String(value), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'iframe'
    ]),
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title'],
      iframe: ['src', 'frameborder', 'allow', 'allowfullscreen'],
      '*': ['class']
    },
    allowedSchemes: ['http', 'https', 'mailto']
  }).trim();

  return clean || null;
}

function makeSlug(value, fallback = 'item') {
  return slugify(String(value || fallback), {
    lower: true,
    strict: true,
    trim: true
  });
}

function toJson(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return JSON.stringify(value);
}

function parseJsonInput(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.stringify(JSON.parse(value));
  } catch (error) {
    const parseError = new Error('Invalid JSON payload.');
    parseError.statusCode = 422;
    throw parseError;
  }
}

module.exports = {
  sanitizePlainText,
  sanitizeRichText,
  makeSlug,
  toJson,
  parseJsonInput
};
