const settingsModel = require('../models/settingsModel');
const pageModel = require('../models/pageModel');
const serviceModel = require('../models/serviceModel');
const productModel = require('../models/productModel');
const projectModel = require('../models/projectModel');
const blogModel = require('../models/blogModel');
const teamModel = require('../models/teamModel');
const mediaAssetModel = require('../models/mediaAssetModel');

function cleanText(value, fallback = 'Kuwexa image') {
  const normalized = String(value || '')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized || fallback;
}

function isManagedImagePath(value) {
  return typeof value === 'string' && value.startsWith('/uploads/images/');
}

function normalizeImageItems(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item) {
        return null;
      }

      if (typeof item === 'string') {
        return { path: item, alt: null };
      }

      if (typeof item === 'object') {
        return {
          path: item.path || item.url || null,
          alt: item.alt || item.alt_text || null
        };
      }

      return null;
    })
    .filter(Boolean);
}

function extractImageReferencesFromHtml(html, defaults = {}) {
  if (!html) {
    return [];
  }

  const matches = [];
  const pattern = /<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let match = pattern.exec(String(html));

  while (match) {
    const tag = match[0];
    const src = match[1];
    const altMatch = tag.match(/\balt=["']([^"']*)["']/i);

    if (isManagedImagePath(src)) {
      matches.push({
        file_path: src,
        title: defaults.title || null,
        alt_text: cleanText(altMatch?.[1] || defaults.altText, defaults.title || 'Kuwexa image'),
        source_module: defaults.sourceModule || null
      });
    }

    match = pattern.exec(String(html));
  }

  return matches;
}

function makeAsset(filePath, options = {}) {
  if (!isManagedImagePath(filePath)) {
    return null;
  }

  return {
    file_path: filePath,
    title: options.title || null,
    alt_text: cleanText(options.altText, options.title || 'Kuwexa image'),
    source_module: options.sourceModule || null
  };
}

function dedupeAssets(items = []) {
  const seen = new Set();
  const result = [];

  items.forEach((item) => {
    if (!item?.file_path || seen.has(item.file_path)) {
      return;
    }

    seen.add(item.file_path);
    result.push(item);
  });

  return result;
}

async function registerAsset(filePath, options = {}) {
  const asset = makeAsset(filePath, options);
  if (!asset) {
    return null;
  }

  return mediaAssetModel.registerAsset(asset);
}

async function registerMany(items = []) {
  return mediaAssetModel.registerMany(dedupeAssets(items));
}

async function syncKnownMediaAssets() {
  const [settings, pages, services, products, projects, posts, teamMembers] = await Promise.all([
    settingsModel.getSettings().catch(() => null),
    pageModel.listAll().catch(() => []),
    serviceModel.listAll().catch(() => []),
    productModel.listAll().catch(() => []),
    projectModel.listAll().catch(() => []),
    blogModel.listAll().catch(() => []),
    teamModel.listAll().catch(() => [])
  ]);

  const assets = [];

  if (settings?.logo_path) {
    assets.push(makeAsset(settings.logo_path, {
      title: settings.company_name || 'Kuwexa',
      altText: `${cleanText(settings.company_name, 'Kuwexa')} logo`,
      sourceModule: 'Settings'
    }));
  }

  if (settings?.favicon_path) {
    assets.push(makeAsset(settings.favicon_path, {
      title: settings.company_name || 'Kuwexa',
      altText: `${cleanText(settings.company_name, 'Kuwexa')} favicon`,
      sourceModule: 'Settings'
    }));
  }

  if (settings?.default_og_image) {
    assets.push(makeAsset(settings.default_og_image, {
      title: settings.company_name || 'Kuwexa',
      altText: settings.default_og_image_alt || `${cleanText(settings.company_name, 'Kuwexa')} social preview`,
      sourceModule: 'SEO'
    }));
  }

  pages.forEach((page) => {
    assets.push(...extractImageReferencesFromHtml(page.body, {
      title: page.title,
      altText: page.title,
      sourceModule: 'Pages'
    }));
  });

  services.forEach((service) => {
    assets.push(makeAsset(service.image, {
      title: service.title,
      altText: `${cleanText(service.title)} service image`,
      sourceModule: 'Services'
    }));
    assets.push(...extractImageReferencesFromHtml(service.description, {
      title: service.title,
      altText: service.title,
      sourceModule: 'Services'
    }));
  });

  products.forEach((product) => {
    assets.push(makeAsset(product.logo, {
      title: product.name,
      altText: `${cleanText(product.name)} logo`,
      sourceModule: 'Products'
    }));

    normalizeImageItems(product.images).forEach((image, index) => {
      assets.push(makeAsset(image.path, {
        title: product.name,
        altText: image.alt || `${cleanText(product.name)} screenshot ${index + 1}`,
        sourceModule: 'Products'
      }));
    });

    assets.push(...extractImageReferencesFromHtml(product.description, {
      title: product.name,
      altText: product.name,
      sourceModule: 'Products'
    }));
  });

  projects.forEach((project) => {
    assets.push(makeAsset(project.featured_image, {
      title: project.title,
      altText: `${cleanText(project.title)} featured image`,
      sourceModule: 'Projects'
    }));

    normalizeImageItems(project.images).forEach((image, index) => {
      assets.push(makeAsset(image.path, {
        title: project.title,
        altText: image.alt || `${cleanText(project.title)} gallery image ${index + 1}`,
        sourceModule: 'Projects'
      }));
    });

    [project.description, project.problem_statement, project.solution, project.results].forEach((html) => {
      assets.push(...extractImageReferencesFromHtml(html, {
        title: project.title,
        altText: project.title,
        sourceModule: 'Projects'
      }));
    });
  });

  posts.forEach((post) => {
    assets.push(makeAsset(post.featured_image, {
      title: post.title,
      altText: `${cleanText(post.title)} featured image`,
      sourceModule: 'Blog'
    }));
    assets.push(...extractImageReferencesFromHtml(post.content, {
      title: post.title,
      altText: post.title,
      sourceModule: 'Blog'
    }));
  });

  teamMembers.forEach((member) => {
    assets.push(makeAsset(member.image, {
      title: member.name,
      altText: `${cleanText(member.name)} portrait`,
      sourceModule: 'Team'
    }));
    assets.push(...extractImageReferencesFromHtml(member.bio, {
      title: member.name,
      altText: member.name,
      sourceModule: 'Team'
    }));
  });

  return registerMany(assets.filter(Boolean));
}

module.exports = {
  cleanText,
  normalizeImageItems,
  extractImageReferencesFromHtml,
  makeAsset,
  registerAsset,
  registerMany,
  syncKnownMediaAssets
};
