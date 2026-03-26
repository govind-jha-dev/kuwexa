const settingsModel = require('../models/settingsModel');
const userModel = require('../models/userModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText, parseJsonInput } = require('../utils/content');
const { registerAsset } = require('../services/mediaAssetService');

function uploadedImagePath(file) {
  return file ? `/uploads/images/${file.filename}` : null;
}

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

async function renderSettingsPage(req, res) {
  const [settings, users] = await Promise.all([
    settingsModel.getSettings(),
    userModel.listAll()
  ]);
  const managers = users.filter((user) => user.role_name === 'manager');

  return renderModule(req, res, {
    pageTitle: 'Website Settings',
    activeMenu: 'Settings',
    form: {
      title: 'Website Settings',
      action: `${getDashboardBasePath(req)}/settings`,
      submitLabel: 'Save Settings',
      enctype: 'multipart/form-data',
      fields: [
        { name: 'company_name', label: 'Company Name', type: 'text', required: true, value: settings?.company_name || '' },
        { name: 'company_email', label: 'Company Email', type: 'email', value: settings?.company_email || '' },
        { name: 'company_phone', label: 'Company Phone', type: 'text', value: settings?.company_phone || '' },
        {
          name: 'logo',
          label: 'Website Logo',
          type: 'file',
          accept: '.png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml',
          previewUrl: settings?.logo_path || '',
          previewMode: 'contain',
          description: 'Upload JPG, JPEG, PNG, WEBP, or SVG logo files. Recommended size: around 320x120 px or any clean horizontal logo. PNG works best for transparent logos, while JPG/JPEG is also supported.'
        },
        {
          name: 'favicon',
          label: 'Website Favicon',
          type: 'file',
          accept: '.ico,.png,.svg,image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml',
          previewUrl: settings?.favicon_path || '',
          previewMode: 'contain',
          description: 'Upload ICO, PNG, or SVG favicon files. Recommended size: square 64x64 px or 128x128 px for sharp browser tab icons.'
        },
        {
          name: 'chat_manager_user_id',
          label: 'Chat Notification Manager',
          type: 'select',
          value: settings?.chat_manager_user_id || '',
          description: 'Only this manager will receive notifications from the website chat widget.',
          options: [
            { label: 'Not assigned', value: '' },
            ...managers.map((manager) => ({
              label: `${manager.name} (${manager.email})`,
              value: manager.id
            }))
          ]
        },
        {
          name: 'show_products_menu',
          label: 'B2B Catalog Visibility',
          type: 'select',
          value: Number(settings?.show_products_menu) === 0 ? '0' : '1',
          description: 'Control whether the public B2B catalog is included in supporting areas such as sitemap generation.',
          options: [
            { label: 'Show B2B Catalog', value: '1' },
            { label: 'Hide B2B Catalog', value: '0' }
          ]
        },
        { name: 'address', label: 'Address', type: 'textarea', value: settings?.address || '' },
        { name: 'hero_title', label: 'Hero Title', type: 'text', value: settings?.hero_title || '' },
        { name: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea', value: settings?.hero_subtitle || '' },
        { name: 'analytics_id', label: 'Google Analytics ID', type: 'text', value: settings?.analytics_id || '' },
        { name: 'search_console_tag', label: 'Search Console Tag', type: 'text', value: settings?.search_console_tag || '' },
        { name: 'default_meta_title', label: 'Default Meta Title', type: 'text', value: settings?.default_meta_title || '' },
        { name: 'default_meta_description', label: 'Default Meta Description', type: 'textarea', value: settings?.default_meta_description || '' },
        {
          name: 'social_links',
          label: 'Social Links JSON',
          type: 'textarea',
          value: settings?.social_links ? JSON.stringify(settings.social_links, null, 2) : '',
          description: 'Use a JSON object with keys like linkedin, facebook, instagram. Example: {"linkedin":"https://...","facebook":"https://...","instagram":"https://..."}'
        }
      ]
    },
    infoPanel: {
      title: 'Brand Theme',
      body: 'Primary color #00240a and secondary color #dbab0d are already configured globally. The branding section supports JPG, JPEG, PNG, WEBP, SVG logo uploads and favicon uploads in ICO, PNG, or SVG format.'
    }
  });
}

async function updateSettings(req, res) {
  const chatManagerUserId = req.body.chat_manager_user_id ? Number(req.body.chat_manager_user_id) : null;
  const payload = {
    company_name: sanitizePlainText(req.body.company_name),
    company_email: sanitizePlainText(req.body.company_email),
    company_phone: sanitizePlainText(req.body.company_phone),
    chat_manager_user_id: Number.isInteger(chatManagerUserId) ? chatManagerUserId : null,
    show_products_menu: req.body.show_products_menu === '0' ? 0 : 1,
    address: sanitizePlainText(req.body.address),
    hero_title: sanitizePlainText(req.body.hero_title),
    hero_subtitle: sanitizePlainText(req.body.hero_subtitle),
    analytics_id: sanitizePlainText(req.body.analytics_id),
    search_console_tag: sanitizePlainText(req.body.search_console_tag),
    default_meta_title: sanitizePlainText(req.body.default_meta_title),
    default_meta_description: sanitizePlainText(req.body.default_meta_description),
    social_links: parseJsonInput(req.body.social_links)
  };

  const logoFile = req.files?.logo?.[0] || req.file || null;
  const faviconFile = req.files?.favicon?.[0] || null;

  if (logoFile) {
    payload.logo_path = uploadedImagePath(logoFile);
  }

  if (faviconFile) {
    payload.favicon_path = uploadedImagePath(faviconFile);
  }

  const settings = await settingsModel.updateSettings(payload);

  await Promise.all([
    registerAsset(settings?.logo_path, {
      title: settings?.company_name,
      altText: `${settings?.company_name || 'Kuwexa'} logo`,
      sourceModule: 'Settings'
    }),
    registerAsset(settings?.favicon_path, {
      title: settings?.company_name,
      altText: `${settings?.company_name || 'Kuwexa'} favicon`,
      sourceModule: 'Settings'
    })
  ]);

  return respond(req, res, { message: 'Settings updated successfully.', settings }, `${getDashboardBasePath(req)}/settings?success=Settings%20updated%20successfully.`);
}

async function apiShow(req, res) {
  const settings = await settingsModel.getSettings();
  return res.json({ settings });
}

module.exports = {
  renderSettingsPage,
  updateSettings,
  apiShow
};
