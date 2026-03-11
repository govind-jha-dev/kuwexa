const jobModel = require('../models/jobModel');
const applicationModel = require('../models/applicationModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText, sanitizeRichText, makeSlug } = require('../utils/content');

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

async function renderCareersPage(req, res) {
  const [jobs, applications] = await Promise.all([
    jobModel.listAll(),
    applicationModel.listAll()
  ]);

  const editingJob = jobs.find((item) => item.id === Number(req.query.edit)) || null;
  const basePath = getDashboardBasePath(req);

  return renderModule(req, res, {
    pageTitle: 'Careers & Applications',
    activeMenu: 'Careers',
    stats: [
      { label: 'Open Jobs', value: jobs.filter((job) => job.status === 'open').length },
      { label: 'Applications', value: applications.length },
      { label: 'Pending Review', value: applications.filter((application) => application.status === 'new').length }
    ],
    form: {
      title: editingJob ? `Edit ${editingJob.title}` : 'Create Job',
      action: editingJob ? `${basePath}/careers/jobs/${editingJob.id}/update` : `${basePath}/careers/jobs`,
      submitLabel: editingJob ? 'Update Job' : 'Create Job',
      fields: [
        { name: 'title', label: 'Job Title', type: 'text', required: true, value: editingJob?.title || '' },
        { name: 'slug', label: 'Slug', type: 'text', value: editingJob?.slug || '' },
        { name: 'location', label: 'Location', type: 'text', value: editingJob?.location || '' },
        { name: 'employment_type', label: 'Employment Type', type: 'text', value: editingJob?.employment_type || '' },
        { name: 'description', label: 'Description', type: 'richtext', value: editingJob?.description || '' },
        { name: 'meta_title', label: 'Meta Title', type: 'text', value: editingJob?.meta_title || '' },
        { name: 'meta_description', label: 'Meta Description', type: 'textarea', value: editingJob?.meta_description || '' },
        { name: 'meta_keywords', label: 'Meta Keywords', type: 'text', value: editingJob?.meta_keywords || '' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          value: editingJob?.status || 'draft',
          options: [
            { label: 'draft', value: 'draft' },
            { label: 'open', value: 'open' },
            { label: 'closed', value: 'closed' }
          ]
        }
      ]
    },
    table: {
      title: 'Job Openings',
      description: 'Publish roles and keep application intake organized.',
      columns: [
        { label: 'Title', key: 'title' },
        { label: 'Location', key: 'location' },
        { label: 'Type', key: 'employment_type' },
        { label: 'Status', key: 'status' },
        { label: 'Updated', key: 'updated_at', type: 'date' }
      ],
      rows: jobs,
      rowActions: (job) => `
        <div class="flex flex-wrap gap-2">
          <a class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" href="${basePath}/careers?edit=${job.id}">Edit</a>
          <form method="post" action="${basePath}/careers/jobs/${job.id}/delete" class="inline-flex">
            <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
            <button class="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white" type="submit">Delete</button>
          </form>
        </div>
      `
    },
    secondaryTable: {
      title: 'Applications',
      description: 'Download resumes and move candidates through the hiring workflow.',
      columns: [
        { label: 'Candidate', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Job', key: 'job_title' },
        { label: 'Status', key: 'status' },
        { label: 'Date', key: 'created_at', type: 'date' }
      ],
      rows: applications,
      rowActions: (application) => `
        <div class="flex flex-wrap gap-2">
          <a class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" href="${application.resume}" target="_blank" rel="noreferrer">Resume</a>
          <form method="post" action="${basePath}/careers/applications/${application.id}/status" class="flex flex-wrap gap-2">
            <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
            <select name="status" class="rounded-full border border-slate-200 px-3 py-1 text-xs">
              ${['new', 'reviewed', 'interview_scheduled', 'rejected', 'selected'].map((status) => `<option value="${status}" ${application.status === status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
            <button class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white" type="submit">Update</button>
          </form>
        </div>
      `
    }
  });
}

async function createJob(req, res) {
  const title = sanitizePlainText(req.body.title);
  const job = await jobModel.createJob({
    title,
    slug: sanitizePlainText(req.body.slug) || makeSlug(title),
    description: sanitizeRichText(req.body.description),
    location: sanitizePlainText(req.body.location),
    employment_type: sanitizePlainText(req.body.employment_type),
    status: sanitizePlainText(req.body.status) || 'draft',
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords)
  });

  return respond(req, res, { message: 'Job created successfully.', job }, `${getDashboardBasePath(req)}/careers?success=Job%20created%20successfully.`);
}

async function updateJob(req, res) {
  const title = sanitizePlainText(req.body.title);
  const job = await jobModel.updateJob(Number(req.params.id), {
    title,
    slug: sanitizePlainText(req.body.slug) || makeSlug(title),
    description: sanitizeRichText(req.body.description),
    location: sanitizePlainText(req.body.location),
    employment_type: sanitizePlainText(req.body.employment_type),
    status: sanitizePlainText(req.body.status) || 'draft',
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords)
  });

  return respond(req, res, { message: 'Job updated successfully.', job }, `${getDashboardBasePath(req)}/careers?success=Job%20updated%20successfully.`);
}

async function deleteJob(req, res) {
  await jobModel.deleteJob(Number(req.params.id));
  return respond(req, res, { message: 'Job deleted successfully.' }, `${getDashboardBasePath(req)}/careers?success=Job%20deleted%20successfully.`);
}

async function updateApplicationStatus(req, res) {
  const application = await applicationModel.updateApplication(Number(req.params.id), {
    status: sanitizePlainText(req.body.status) || 'new'
  });

  return respond(req, res, { message: 'Application updated successfully.', application }, `${getDashboardBasePath(req)}/careers?success=Application%20updated%20successfully.`);
}

async function apiList(req, res) {
  const [jobs, applications] = await Promise.all([
    jobModel.listAll(),
    applicationModel.listAll()
  ]);

  return res.json({ jobs, applications });
}

module.exports = {
  renderCareersPage,
  createJob,
  updateJob,
  deleteJob,
  updateApplicationStatus,
  apiList
};
