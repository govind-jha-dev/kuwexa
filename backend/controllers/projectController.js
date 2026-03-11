const projectModel = require('../models/projectModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText, sanitizeRichText, makeSlug, toJson } = require('../utils/content');
const { splitCsv } = require('../utils/serializers');

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

function imagePaths(files = []) {
  return files.map((file) => `/uploads/images/${file.filename}`);
}

async function renderProjectsPage(req, res) {
  const projects = await projectModel.listAll();
  const editingProject = projects.find((item) => item.id === Number(req.query.edit)) || null;
  const basePath = getDashboardBasePath(req);

  return renderModule(req, res, {
    pageTitle: 'Projects Management',
    activeMenu: 'Projects',
    stats: [
      { label: 'Projects', value: projects.length },
      { label: 'Published', value: projects.filter((project) => project.status === 'published').length }
    ],
    form: {
      title: editingProject ? `Edit ${editingProject.title}` : 'Create Project',
      action: editingProject ? `${basePath}/portfolio/${editingProject.id}/update` : `${basePath}/portfolio`,
      submitLabel: editingProject ? 'Update Project' : 'Create Project',
      enctype: 'multipart/form-data',
      fields: [
        { name: 'title', label: 'Project Title', type: 'text', required: true, value: editingProject?.title || '' },
        { name: 'slug', label: 'Slug', type: 'text', value: editingProject?.slug || '' },
        { name: 'short_description', label: 'Short Description', type: 'textarea', rows: 3, value: editingProject?.short_description || '' },
        { name: 'client', label: 'Client', type: 'text', value: editingProject?.client || '' },
        { name: 'client_industry', label: 'Client Industry', type: 'text', value: editingProject?.client_industry || '' },
        { name: 'category', label: 'Category', type: 'text', value: editingProject?.category || '' },
        { name: 'technologies', label: 'Technologies (comma separated)', type: 'text', value: editingProject?.technologies?.join(', ') || '' },
        { name: 'description', label: 'Project Overview', type: 'richtext', value: editingProject?.description || '' },
        { name: 'problem_statement', label: 'Problem Statement', type: 'richtext', value: editingProject?.problem_statement || '' },
        { name: 'solution', label: 'Solution', type: 'richtext', value: editingProject?.solution || '' },
        { name: 'results', label: 'Results', type: 'richtext', value: editingProject?.results || '' },
        { name: 'images', label: 'Project Images', type: 'file', accept: 'image/*', multiple: true },
        { name: 'meta_title', label: 'Meta Title', type: 'text', value: editingProject?.meta_title || '' },
        { name: 'meta_description', label: 'Meta Description', type: 'textarea', value: editingProject?.meta_description || '' },
        { name: 'meta_keywords', label: 'Meta Keywords', type: 'text', value: editingProject?.meta_keywords || '' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          value: editingProject?.status || 'draft',
          options: [
            { label: 'draft', value: 'draft' },
            { label: 'published', value: 'published' }
          ]
        }
      ]
    },
    table: {
      title: 'Projects',
      description: 'Add case studies, client context, screenshots, technology details, and delivery outcomes.',
      columns: [
        { label: 'Title', key: 'title' },
        { label: 'Client', key: 'client' },
        { label: 'Category', key: 'category' },
        { label: 'Status', key: 'status' },
        { label: 'Updated', key: 'updated_at', type: 'date' }
      ],
      rows: projects,
      rowActions: (project) => `
        <div class="flex flex-wrap gap-2">
          <a class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" href="${basePath}/portfolio?edit=${project.id}">Edit</a>
          <form method="post" action="${basePath}/portfolio/${project.id}/delete" class="inline-flex">
            <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
            <button class="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white" type="submit">Delete</button>
          </form>
        </div>
      `
    }
  });
}

async function createProject(req, res) {
  const title = sanitizePlainText(req.body.title);
  const images = imagePaths(req.files);

  const project = await projectModel.createProject({
    title,
    slug: sanitizePlainText(req.body.slug) || makeSlug(title),
    short_description: sanitizePlainText(req.body.short_description),
    description: sanitizeRichText(req.body.description),
    client: sanitizePlainText(req.body.client),
    client_industry: sanitizePlainText(req.body.client_industry),
    technologies: toJson(splitCsv(req.body.technologies)),
    category: sanitizePlainText(req.body.category),
    problem_statement: sanitizeRichText(req.body.problem_statement),
    solution: sanitizeRichText(req.body.solution),
    results: sanitizeRichText(req.body.results),
    images: toJson(images),
    featured_image: images[0] || null,
    status: sanitizePlainText(req.body.status) || 'draft',
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords),
    created_by: req.user.id,
    updated_by: req.user.id
  });

  return respond(req, res, { message: 'Project created successfully.', project }, `${getDashboardBasePath(req)}/portfolio?success=Project%20created%20successfully.`);
}

async function updateProject(req, res) {
  const title = sanitizePlainText(req.body.title);
  const updates = {
    title,
    slug: sanitizePlainText(req.body.slug) || makeSlug(title),
    short_description: sanitizePlainText(req.body.short_description),
    description: sanitizeRichText(req.body.description),
    client: sanitizePlainText(req.body.client),
    client_industry: sanitizePlainText(req.body.client_industry),
    technologies: toJson(splitCsv(req.body.technologies)),
    category: sanitizePlainText(req.body.category),
    problem_statement: sanitizeRichText(req.body.problem_statement),
    solution: sanitizeRichText(req.body.solution),
    results: sanitizeRichText(req.body.results),
    status: sanitizePlainText(req.body.status) || 'draft',
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords),
    updated_by: req.user.id
  };

  const images = imagePaths(req.files);
  if (images.length) {
    updates.images = toJson(images);
    updates.featured_image = images[0];
  }

  const project = await projectModel.updateProject(Number(req.params.id), updates);
  return respond(req, res, { message: 'Project updated successfully.', project }, `${getDashboardBasePath(req)}/portfolio?success=Project%20updated%20successfully.`);
}

async function deleteProject(req, res) {
  await projectModel.deleteProject(Number(req.params.id));
  return respond(req, res, { message: 'Project deleted successfully.' }, `${getDashboardBasePath(req)}/portfolio?success=Project%20deleted%20successfully.`);
}

async function apiList(req, res) {
  const projects = await projectModel.listAll();
  return res.json({ projects });
}

module.exports = {
  renderProjectsPage,
  createProject,
  updateProject,
  deleteProject,
  apiList
};
