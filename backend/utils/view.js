const { PERMISSIONS, hasPermission } = require('../config/permissions');

function formatDate(dateValue) {
  if (!dateValue) {
    return '';
  }

  return new Date(dateValue).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function titleCase(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildDashboardMenu(user, basePath) {
  const items = [
    { label: 'Dashboard', href: `${basePath}/dashboard`, permission: PERMISSIONS.DASHBOARD_VIEW },
    { label: 'Pages', href: `${basePath}/pages`, permission: PERMISSIONS.PAGES_MANAGE },
    { label: 'Services', href: `${basePath}/services`, permission: PERMISSIONS.SERVICES_MANAGE },
    { label: 'Portfolio', href: `${basePath}/portfolio`, permission: PERMISSIONS.PORTFOLIO_MANAGE },
    { label: 'Team', href: `${basePath}/team`, permission: PERMISSIONS.TEAM_MANAGE },
    { label: 'Chats', href: `${basePath}/chats`, permission: PERMISSIONS.CHATS_MANAGE },
    { label: 'Blog', href: `${basePath}/blog`, permission: PERMISSIONS.BLOG_MANAGE },
    { label: 'Leads', href: `${basePath}/leads`, permission: PERMISSIONS.LEADS_MANAGE },
    { label: 'Careers', href: `${basePath}/careers`, permission: PERMISSIONS.CAREERS_MANAGE },
    { label: 'Users', href: `${basePath}/users`, permission: PERMISSIONS.USERS_MANAGE },
    { label: 'SEO', href: `${basePath}/seo`, permission: PERMISSIONS.SEO_MANAGE },
    { label: 'Settings', href: `${basePath}/settings`, permission: PERMISSIONS.SETTINGS_MANAGE },
    { label: 'Analytics', href: `${basePath}/analytics`, permission: PERMISSIONS.ANALYTICS_VIEW }
  ];

  return items.filter((item) => hasPermission(user, item.permission));
}

module.exports = {
  buildDashboardMenu,
  formatDate,
  titleCase
};
