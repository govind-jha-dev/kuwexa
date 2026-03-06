const env = require('../config/env');
const pageModel = require('../models/pageModel');
const serviceModel = require('../models/serviceModel');
const projectModel = require('../models/projectModel');
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
  const [pages, services, projects, posts, jobs, teamMembers] = await Promise.all([
    pageModel.listPublished(),
    serviceModel.listPublished(),
    projectModel.listPublished(),
    blogModel.listPublished(),
    jobModel.listOpen(),
    teamModel.listActive()
  ]);

  const staticUrls = [
    urlNode('/'),
    urlNode('/services'),
    urlNode('/portfolio'),
    urlNode('/blog'),
    urlNode('/careers'),
    urlNode('/team'),
    urlNode('/contact')
  ];

  const dynamicUrls = [
    ...pages.map((page) => urlNode(`/${page.slug}`, page.updated_at)),
    ...services.map((service) => urlNode(`/services/${service.slug}`, service.updated_at)),
    ...projects.map((project) => urlNode(`/portfolio/${project.slug}`, project.updated_at)),
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
