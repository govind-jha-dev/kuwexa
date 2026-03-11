function firstHeaderValue(value) {
  if (!value) {
    return null;
  }

  return String(value)
    .split(',')[0]
    .trim() || null;
}

function normalizeIp(value) {
  if (!value) {
    return null;
  }

  const trimmed = String(value).trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.startsWith('::ffff:') ? trimmed.slice(7) : trimmed;
}

function getClientIp(req) {
  return normalizeIp(
    firstHeaderValue(req.get('x-forwarded-for'))
    || req.get('cf-connecting-ip')
    || req.get('x-real-ip')
    || req.ip
    || req.socket?.remoteAddress
  );
}

function getGeoFromHeaders(req) {
  const countryCode = firstHeaderValue(
    req.get('cf-ipcountry')
    || req.get('x-vercel-ip-country')
    || req.get('cloudfront-viewer-country')
    || req.get('x-geo-country')
    || req.get('x-country-code')
  );

  const city = firstHeaderValue(
    req.get('x-vercel-ip-city')
    || req.get('cloudfront-viewer-city')
    || req.get('x-geo-city')
    || req.get('x-city')
  );

  const countryName = firstHeaderValue(
    req.get('x-country-name')
    || req.get('x-vercel-ip-country-name')
    || countryCode
  );

  return {
    countryCode: countryCode || null,
    countryName: countryName || null,
    city: city || null
  };
}

function isPublicWebsiteRequest(req) {
  return !req.path.startsWith('/admin')
    && !req.path.startsWith('/manager')
    && !req.path.startsWith('/api')
    && !req.path.startsWith('/uploads')
    && !req.path.startsWith('/styles')
    && !req.path.startsWith('/scripts')
    && !req.path.startsWith('/favicon')
    && !req.path.startsWith('/login')
    && !req.path.endsWith('.xml')
    && !req.path.endsWith('.txt');
}

module.exports = {
  getClientIp,
  getGeoFromHeaders,
  isPublicWebsiteRequest
};
