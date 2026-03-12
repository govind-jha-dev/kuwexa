const chatInquiryModel = require('../models/chatInquiryModel');
const settingsModel = require('../models/settingsModel');
const userModel = require('../models/userModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText } = require('../utils/content');
const { sendChatAlert, sendChatConfirmation } = require('../services/emailService');

function wantsJson(req) {
  return req.originalUrl.startsWith('/api/')
    || req.get('x-requested-with') === 'XMLHttpRequest'
    || req.get('accept')?.includes('application/json');
}

function respond(req, res, payload, redirectUrl, statusCode = 200) {
  if (wantsJson(req)) {
    return res.status(statusCode).json(payload);
  }

  return res.redirect(redirectUrl);
}

async function renderChatsPage(req, res) {
  const chats = req.user.role_name === 'super_admin'
    ? await chatInquiryModel.listAll()
    : await chatInquiryModel.listForManager(req.user.id);

  const basePath = getDashboardBasePath(req);
  const escapeHtml = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  return renderModule(req, res, {
    pageTitle: 'Chat Inbox',
    activeMenu: 'Chats',
    stats: [
      { label: 'Chat Inquiries', value: chats.length },
      { label: 'New', value: chats.filter((chat) => chat.status === 'new').length },
      { label: 'Replied', value: chats.filter((chat) => chat.status === 'replied').length }
    ],
    infoPanel: {
      title: 'Website chat inquiries notify the designated manager only.',
      body: 'Use Website Settings to choose the manager who receives chat alerts. Managers only see chats assigned to them, while admins can review the full chat inbox.'
    },
    table: {
      title: 'Chat Inquiries',
      description: 'Messages submitted from the website chat widget appear here for follow-up.',
      columns: [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Topic', key: 'topic' },
        { label: 'Manager', key: 'manager_name' },
        { label: 'Status', key: 'status' },
        { label: 'Date', key: 'created_at', type: 'date' }
      ],
      rows: chats,
      rowActions: (chat) => `
        <div class="space-y-3">
          <div class="rounded-2xl bg-slate-50 p-3 text-xs leading-6 text-slate-600">
            <strong class="text-primary">Message:</strong><br>${escapeHtml(chat.message)}
          </div>
          <form method="post" action="${basePath}/chats/${chat.id}/update" class="flex flex-wrap gap-2">
            <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
            <select name="status" class="rounded-full border border-slate-200 px-3 py-1 text-xs">
              ${['new', 'replied', 'closed'].map((status) => `<option value="${status}" ${chat.status === status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
            <input name="manager_notes" value="${escapeHtml(chat.manager_notes)}" placeholder="Manager notes" class="rounded-full border border-slate-200 px-3 py-1 text-xs">
            <button class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white" type="submit">Save</button>
          </form>
        </div>
      `
    }
  });
}

async function submitChat(req, res) {
  const settings = await settingsModel.getSettings();
  const managerId = settings?.chat_manager_user_id ? Number(settings.chat_manager_user_id) : null;
  const manager = managerId ? await userModel.findById(managerId) : null;

  let chat = await chatInquiryModel.createChat({
    name: sanitizePlainText(req.body.name),
    email: sanitizePlainText(req.body.email),
    phone: sanitizePlainText(req.body.phone),
    topic: sanitizePlainText(req.body.topic),
    message: sanitizePlainText(req.body.message),
    page_path: sanitizePlainText(req.body.page_path) || req.path,
    manager_user_id: manager?.id || null
  });

  await sendChatConfirmation(chat).catch(() => false);

  if (manager?.email) {
    const sent = await sendChatAlert(chat, manager).catch(() => false);
    if (sent) {
      chat = await chatInquiryModel.updateChat(chat.id, {
        notified_at: new Date()
      });
    }
  }

  return respond(
    req,
    res,
    { message: 'Chat inquiry submitted successfully.', chat },
    '/?chat=Your%20message%20has%20been%20sent.',
    201
  );
}

async function updateChat(req, res) {
  const chat = await chatInquiryModel.updateChat(Number(req.params.id), {
    status: sanitizePlainText(req.body.status) || 'new',
    manager_notes: sanitizePlainText(req.body.manager_notes)
  });

  return respond(req, res, { message: 'Chat updated successfully.', chat }, `${getDashboardBasePath(req)}/chats?success=Chat%20updated%20successfully.`);
}

async function apiList(req, res) {
  const chats = req.user.role_name === 'super_admin'
    ? await chatInquiryModel.listAll()
    : await chatInquiryModel.listForManager(req.user.id);

  return res.json({ chats });
}

module.exports = {
  renderChatsPage,
  submitChat,
  updateChat,
  apiList
};
