const leadModel = require('../models/leadModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText } = require('../utils/content');

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

async function renderLeadsPage(req, res) {
  const leads = await leadModel.listAll();
  const basePath = getDashboardBasePath(req);
  const escapeAttribute = (value) => String(value || '').replace(/"/g, '&quot;');

  return renderModule(req, res, {
    pageTitle: 'Lead Management',
    activeMenu: 'Leads',
    stats: [
      { label: 'Total Leads', value: leads.length },
      { label: 'New', value: leads.filter((lead) => lead.status === 'new').length },
      { label: 'Qualified', value: leads.filter((lead) => lead.status === 'qualified').length }
    ],
    infoPanel: {
      title: 'Lead Intake',
      body: 'Leads are created by the public contact form. Managers can update status, ownership, and notes from this screen.'
    },
    table: {
      title: 'Leads',
      description: 'Track inquiries from first contact to closed deal.',
      columns: [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'phone' },
        { label: 'Source', key: 'source' },
        { label: 'Status', key: 'status' },
        { label: 'Date', key: 'created_at', type: 'date' }
      ],
      rows: leads,
      rowActions: (lead) => `
        <form method="post" action="${basePath}/leads/${lead.id}/update" class="flex flex-wrap gap-2">
          <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
          <select name="status" class="rounded-full border border-slate-200 px-3 py-1 text-xs">
            ${['new', 'contacted', 'qualified', 'closed'].map((status) => `<option value="${status}" ${lead.status === status ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
          <input name="notes" value="${escapeAttribute(lead.notes)}" placeholder="Notes" class="rounded-full border border-slate-200 px-3 py-1 text-xs">
          <button class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white" type="submit">Save</button>
        </form>
      `
    }
  });
}

async function updateLead(req, res) {
  const lead = await leadModel.updateLead(Number(req.params.id), {
    status: sanitizePlainText(req.body.status) || 'new',
    notes: sanitizePlainText(req.body.notes)
  });

  return respond(req, res, { message: 'Lead updated successfully.', lead }, `${getDashboardBasePath(req)}/leads?success=Lead%20updated%20successfully.`);
}

async function apiList(req, res) {
  const leads = await leadModel.listAll();
  return res.json({ leads });
}

module.exports = {
  renderLeadsPage,
  updateLead,
  apiList
};
