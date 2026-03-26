const env = require('../config/env');
const pageModel = require('../models/pageModel');
const settingsModel = require('../models/settingsModel');
const productModel = require('../models/productModel');
const blogModel = require('../models/blogModel');
const jobModel = require('../models/jobModel');
const teamModel = require('../models/teamModel');

function urlNode(pathname, lastmod) {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return [
    '<url>',
    `<loc>${env.appUrl}${normalized}</loc>`,
    lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : '',
    '</url>'
  ].join('');
}

async function generateSitemapXml() {
  const [settings, pages, products, posts, jobs, teamMembers] = await Promise.all([
    settingsModel.getSettings(),
    pageModel.listPublished(),
    productModel.listPublished(),
    blogModel.listPublished(),
    jobModel.listOpen(),
    teamModel.listActive()
  ]);
  const showProducts = Number(settings?.show_products_menu) !== 0;

  const staticUrls = [
    urlNode('/'),
    urlNode('/divisions'),
    urlNode('/blog'),
    urlNode('/careers'),
    urlNode('/team'),
    urlNode('/contact')
  ];

  if (showProducts) {
    staticUrls.splice(2, 0, urlNode('/b2b'));
  }

  const dynamicUrls = [
    ...pages.map((page) => urlNode(`/${page.slug}`, page.updated_at)),
    urlNode('/divisions/codexwebz'),
    urlNode('/divisions/kuwexa-lifestyle'),
    ...(showProducts ? products.map((product) => urlNode(`/b2b/products/${product.slug}`, product.updated_at)) : []),
    ...posts.map((post) => urlNode(`/blog/${post.slug}`, post.updated_at)),
    ...jobs.map((job) => urlNode(`/careers/${job.slug}`, job.updated_at)),
    ...teamMembers.map((member) => urlNode(`/team/${member.slug}`, member.updated_at))
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...dynamicUrls,
    '</urlset>'
  ].join('');
}

module.exports = {
  generateSitemapXml
};
