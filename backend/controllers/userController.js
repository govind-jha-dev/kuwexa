const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const roleModel = require('../models/roleModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText } = require('../utils/content');

function buildRedirectPath(req, suffix = 'users') {
  return `${getDashboardBasePath(req)}/${suffix}`;
}

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

async function renderUsersPage(req, res) {
  const [users, roles] = await Promise.all([
    userModel.listAll(),
    roleModel.listAll()
  ]);

  const editingUser = users.find((item) => item.id === Number(req.query.edit)) || null;
  const basePath = getDashboardBasePath(req);

  return renderModule(req, res, {
    pageTitle: 'User Management',
    activeMenu: 'Users',
    stats: [
      { label: 'System Users', value: users.length },
      { label: 'Active Users', value: users.filter((user) => user.status === 'active').length }
    ],
    form: {
      title: editingUser ? `Edit ${editingUser.name}` : 'Create User',
      action: editingUser ? `${basePath}/users/${editingUser.id}/update` : `${basePath}/users`,
      submitLabel: editingUser ? 'Update User' : 'Create User',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true, value: editingUser?.name || '' },
        { name: 'email', label: 'Email', type: 'email', required: true, value: editingUser?.email || '' },
        {
          name: 'role_id',
          label: 'Role',
          type: 'select',
          required: true,
          value: editingUser?.role_id || '',
          options: roles.map((role) => ({ label: role.role_name, value: role.id }))
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          value: editingUser?.status || 'active',
          options: [
            { label: 'active', value: 'active' },
            { label: 'inactive', value: 'inactive' }
          ]
        },
        {
          name: 'password',
          label: editingUser ? 'Reset Password (optional)' : 'Password',
          type: 'password',
          required: !editingUser,
          value: ''
        }
      ]
    },
    table: {
      title: 'Users',
      description: 'Create users, assign roles, deactivate accounts, and rotate passwords.',
      columns: [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Role', key: 'role_name' },
        { label: 'Status', key: 'status' },
        { label: 'Last Login', key: 'last_login_at', type: 'date' }
      ],
      rows: users,
      rowActions: (user) => `
        <div class="flex flex-wrap gap-2">
          <a class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" href="${basePath}/users?edit=${user.id}">Edit</a>
          <form method="post" action="${basePath}/users/${user.id}/status" class="inline-flex">
            <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
            <input type="hidden" name="status" value="${user.status === 'active' ? 'inactive' : 'active'}">
            <button class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white" type="submit">
              ${user.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          </form>
        </div>
      `
    }
  });
}

async function createUser(req, res) {
  const password = await bcrypt.hash(req.body.password, 12);

  const user = await userModel.createUser({
    name: sanitizePlainText(req.body.name),
    email: sanitizePlainText(req.body.email),
    password,
    role_id: Number(req.body.role_id),
    status: sanitizePlainText(req.body.status) || 'active'
  });

  return respond(req, res, { message: 'User created successfully.', user }, `${buildRedirectPath(req)}?success=User%20created%20successfully.`);
}

async function updateUser(req, res) {
  const updates = {
    name: sanitizePlainText(req.body.name),
    email: sanitizePlainText(req.body.email),
    role_id: Number(req.body.role_id),
    status: sanitizePlainText(req.body.status) || 'active'
  };

  if (req.body.password) {
    updates.password = await bcrypt.hash(req.body.password, 12);
  }

  const user = await userModel.updateUser(Number(req.params.id), updates);
  return respond(req, res, { message: 'User updated successfully.', user }, `${buildRedirectPath(req)}?success=User%20updated%20successfully.`);
}

async function updateStatus(req, res) {
  const user = await userModel.updateUser(Number(req.params.id), {
    status: sanitizePlainText(req.body.status) || 'inactive'
  });

  return respond(req, res, { message: 'User status updated.', user }, `${buildRedirectPath(req)}?success=User%20status%20updated.`);
}

async function apiList(req, res) {
  const [users, roles] = await Promise.all([
    userModel.listAll(),
    roleModel.listAll()
  ]);

  return res.json({ users, roles });
}

module.exports = {
  renderUsersPage,
  createUser,
  updateUser,
  updateStatus,
  apiList
};
