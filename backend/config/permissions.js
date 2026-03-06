const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  USERS_MANAGE: 'users.manage',
  SETTINGS_MANAGE: 'settings.manage',
  PAGES_MANAGE: 'pages.manage',
  SERVICES_MANAGE: 'services.manage',
  PORTFOLIO_MANAGE: 'portfolio.manage',
  TEAM_MANAGE: 'team.manage',
  CHATS_MANAGE: 'chats.manage',
  BLOG_MANAGE: 'blog.manage',
  LEADS_MANAGE: 'leads.manage',
  CAREERS_MANAGE: 'careers.manage',
  SEO_MANAGE: 'seo.manage',
  ANALYTICS_VIEW: 'analytics.view'
};

const ROLE_PERMISSIONS = {
  super_admin: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.SETTINGS_MANAGE,
    PERMISSIONS.PAGES_MANAGE,
    PERMISSIONS.SERVICES_MANAGE,
    PERMISSIONS.PORTFOLIO_MANAGE,
    PERMISSIONS.TEAM_MANAGE,
    PERMISSIONS.CHATS_MANAGE,
    PERMISSIONS.BLOG_MANAGE,
    PERMISSIONS.LEADS_MANAGE,
    PERMISSIONS.CAREERS_MANAGE,
    PERMISSIONS.SEO_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW
  ],
  manager: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SERVICES_MANAGE,
    PERMISSIONS.PORTFOLIO_MANAGE,
    PERMISSIONS.TEAM_MANAGE,
    PERMISSIONS.CHATS_MANAGE,
    PERMISSIONS.BLOG_MANAGE,
    PERMISSIONS.LEADS_MANAGE,
    PERMISSIONS.CAREERS_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW
  ],
  editor: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.BLOG_MANAGE
  ]
};

function hasPermission(user, permission) {
  const dbPermissions = Array.isArray(user?.permissions) ? user.permissions : [];
  const rolePermissions = ROLE_PERMISSIONS[user?.role_name] || [];
  const permissions = new Set([...rolePermissions, ...dbPermissions]);
  return permissions.has(permission);
}

module.exports = {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission
};
