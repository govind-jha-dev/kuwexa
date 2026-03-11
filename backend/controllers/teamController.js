const teamModel = require('../models/teamModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText, sanitizeRichText, makeSlug } = require('../utils/content');

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

function imagePath(file) {
  return file ? `/uploads/images/${file.filename}` : null;
}

function normalizeMemberType(value) {
  return value === 'leadership' ? 'leadership' : 'employee';
}

function normalizeStatus(value) {
  return value === 'inactive' ? 'inactive' : 'active';
}

function normalizeSortOrder(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function renderTeamPage(req, res) {
  const members = await teamModel.listAll();
  const editingMember = members.find((item) => item.id === Number(req.query.edit)) || null;
  const basePath = getDashboardBasePath(req);

  return renderModule(req, res, {
    pageTitle: 'Team Management',
    activeMenu: 'Team',
    stats: [
      { label: 'Team Members', value: members.length },
      { label: 'Leadership', value: members.filter((member) => member.member_type === 'leadership').length },
      { label: 'Active Profiles', value: members.filter((member) => member.status === 'active').length }
    ],
    form: {
      title: editingMember ? `Edit ${editingMember.name}` : 'Add Team Member',
      action: editingMember ? `${basePath}/team/${editingMember.id}/update` : `${basePath}/team`,
      submitLabel: editingMember ? 'Update Profile' : 'Create Profile',
      enctype: 'multipart/form-data',
      fields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true, value: editingMember?.name || '', placeholder: 'Aarav Singh' },
        { name: 'slug', label: 'Slug', type: 'text', value: editingMember?.slug || '', placeholder: 'aarav-singh' },
        {
          name: 'member_type',
          label: 'Member Type',
          type: 'select',
          value: editingMember?.member_type || 'employee',
          options: [
            { label: 'Leadership', value: 'leadership' },
            { label: 'Employee', value: 'employee' }
          ]
        },
        { name: 'designation', label: 'Designation', type: 'text', required: true, value: editingMember?.designation || '', placeholder: 'Chief Executive Officer' },
        { name: 'department', label: 'Department', type: 'text', value: editingMember?.department || '', placeholder: 'Strategy and Growth' },
        {
          name: 'short_bio',
          label: 'Short Bio',
          type: 'textarea',
          value: editingMember?.short_bio || '',
          rows: 3,
          description: 'Short card copy shown prominently on the public leadership and employee cards.',
          placeholder: 'Leads delivery strategy, growth planning, and product direction.'
        },
        {
          name: 'bio',
          label: 'Detailed Bio',
          type: 'richtext',
          value: editingMember?.bio || '',
          rows: 10,
          description: 'Full about content for the public profile card. Use this for richer profile storytelling and background.'
        },
        { name: 'email', label: 'Email', type: 'email', value: editingMember?.email || '', placeholder: 'name@codexwebz.com', description: 'Displayed as a clickable contact option on the public card.' },
        { name: 'phone', label: 'Phone', type: 'text', value: editingMember?.phone || '', placeholder: '+91 90000 00000', description: 'Shown as a call/contact option when provided.' },
        { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url', value: editingMember?.linkedin_url || '', placeholder: 'https://www.linkedin.com/in/username', description: 'Primary professional social profile link.' },
        { name: 'twitter_url', label: 'Twitter URL', type: 'url', value: editingMember?.twitter_url || '', placeholder: 'https://x.com/username', description: 'Optional social profile link for the public card.' },
        { name: 'facebook_url', label: 'Facebook URL', type: 'url', value: editingMember?.facebook_url || '', placeholder: 'https://www.facebook.com/username', description: 'Optional Facebook profile link for the public card.' },
        {
          name: 'image',
          label: 'Profile Image',
          type: 'file',
          accept: 'image/*',
          previewUrl: editingMember?.image || '',
          description: 'Upload a square or portrait team image for the public profile cards.'
        },
        { name: 'meta_title', label: 'Meta Title', type: 'text', value: editingMember?.meta_title || '' },
        { name: 'meta_description', label: 'Meta Description', type: 'textarea', value: editingMember?.meta_description || '' },
        { name: 'meta_keywords', label: 'Meta Keywords', type: 'text', value: editingMember?.meta_keywords || '' },
        { name: 'sort_order', label: 'Display Order', type: 'number', value: editingMember?.sort_order ?? 0, min: 0, step: 1 },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          value: editingMember?.status || 'active',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' }
          ]
        }
      ]
    },
    infoPanel: {
      title: 'Leadership and employee cards are fully controlled here.',
      body: 'Upload profile images, set social links, write short and detailed about content, control sort order, and decide whether a person appears in the Leadership row or the Employee row across the public website.'
    },
    table: {
      title: 'Team Directory',
      description: 'Manage the public leadership and employee card content used across the website.',
      columns: [
        { label: 'Name', key: 'name' },
        { label: 'Type', key: 'member_type' },
        { label: 'Designation', key: 'designation' },
        { label: 'Department', key: 'department' },
        { label: 'Status', key: 'status' },
        { label: 'Updated', key: 'updated_at', type: 'date' }
      ],
      rows: members,
      rowActions: (member) => `
        <div class="flex flex-wrap gap-2">
          <a class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" href="${basePath}/team?edit=${member.id}">Edit</a>
          <form method="post" action="${basePath}/team/${member.id}/delete" class="inline-flex">
            <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
            <button class="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white" type="submit">Delete</button>
          </form>
        </div>
      `
    }
  });
}

async function createTeamMember(req, res) {
  const name = sanitizePlainText(req.body.name);
  const member = await teamModel.createTeamMember({
    name,
    slug: sanitizePlainText(req.body.slug) || makeSlug(name, 'team-member'),
    member_type: normalizeMemberType(sanitizePlainText(req.body.member_type)),
    designation: sanitizePlainText(req.body.designation),
    department: sanitizePlainText(req.body.department),
    short_bio: sanitizePlainText(req.body.short_bio),
    bio: sanitizeRichText(req.body.bio),
    email: sanitizePlainText(req.body.email),
    phone: sanitizePlainText(req.body.phone),
    image: imagePath(req.file),
    linkedin_url: sanitizePlainText(req.body.linkedin_url),
    twitter_url: sanitizePlainText(req.body.twitter_url),
    facebook_url: sanitizePlainText(req.body.facebook_url),
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords),
    status: normalizeStatus(sanitizePlainText(req.body.status)),
    sort_order: normalizeSortOrder(req.body.sort_order)
  });

  return respond(req, res, { message: 'Team member created successfully.', member }, `${getDashboardBasePath(req)}/team?success=Team%20member%20created%20successfully.`);
}

async function updateTeamMember(req, res) {
  const name = sanitizePlainText(req.body.name);
  const updates = {
    name,
    slug: sanitizePlainText(req.body.slug) || makeSlug(name, 'team-member'),
    member_type: normalizeMemberType(sanitizePlainText(req.body.member_type)),
    designation: sanitizePlainText(req.body.designation),
    department: sanitizePlainText(req.body.department),
    short_bio: sanitizePlainText(req.body.short_bio),
    bio: sanitizeRichText(req.body.bio),
    email: sanitizePlainText(req.body.email),
    phone: sanitizePlainText(req.body.phone),
    linkedin_url: sanitizePlainText(req.body.linkedin_url),
    twitter_url: sanitizePlainText(req.body.twitter_url),
    facebook_url: sanitizePlainText(req.body.facebook_url),
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords),
    status: normalizeStatus(sanitizePlainText(req.body.status)),
    sort_order: normalizeSortOrder(req.body.sort_order)
  };

  if (req.file) {
    updates.image = imagePath(req.file);
  }

  const member = await teamModel.updateTeamMember(Number(req.params.id), updates);
  return respond(req, res, { message: 'Team member updated successfully.', member }, `${getDashboardBasePath(req)}/team?success=Team%20member%20updated%20successfully.`);
}

async function deleteTeamMember(req, res) {
  await teamModel.deleteTeamMember(Number(req.params.id));
  return respond(req, res, { message: 'Team member deleted successfully.' }, `${getDashboardBasePath(req)}/team?success=Team%20member%20deleted%20successfully.`);
}

async function apiList(req, res) {
  const teamMembers = await teamModel.listAll();
  return res.json({
    teamMembers,
    grouped: teamModel.groupMembers(teamMembers)
  });
}

async function publicApiList(req, res) {
  const teamMembers = await teamModel.listActive();
  return res.json({
    teamMembers,
    grouped: teamModel.groupMembers(teamMembers)
  });
}

module.exports = {
  renderTeamPage,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  apiList,
  publicApiList
};
