const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const userController = require('../controllers/userController');
const pageController = require('../controllers/pageController');
const serviceController = require('../controllers/serviceController');
const productController = require('../controllers/productController');
const projectController = require('../controllers/projectController');
const teamController = require('../controllers/teamController');
const chatController = require('../controllers/chatController');
const blogController = require('../controllers/blogController');
const leadController = require('../controllers/leadController');
const careerController = require('../controllers/careerController');
const seoController = require('../controllers/seoController');
const settingsController = require('../controllers/settingsController');
const analyticsController = require('../controllers/analyticsController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { validateCsrfToken } = require('../middleware/csrfMiddleware');
const { PERMISSIONS } = require('../config/permissions');
const { imageUpload } = require('../middleware/uploadMiddleware');
const {
  handleValidationErrors,
  userValidation,
  passwordValidation,
  pageValidation,
  serviceValidation,
  productValidation,
  projectValidation,
  teamValidation,
  blogValidation,
  jobValidation,
  seoValidation,
  settingsValidation
} = require('../validators');

const router = express.Router();

router.use(requireAuth);

router.get('/', (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', authorize(PERMISSIONS.DASHBOARD_VIEW), dashboardController.renderHome);

router.get('/users', authorize(PERMISSIONS.USERS_MANAGE), userController.renderUsersPage);
router.post('/users', authorize(PERMISSIONS.USERS_MANAGE), userValidation, passwordValidation, handleValidationErrors, userController.createUser);
router.post('/users/:id/update', authorize(PERMISSIONS.USERS_MANAGE), userValidation, handleValidationErrors, userController.updateUser);
router.post('/users/:id/status', authorize(PERMISSIONS.USERS_MANAGE), userController.updateStatus);

router.get('/pages', authorize(PERMISSIONS.PAGES_MANAGE), pageController.renderPagesPage);
router.post('/pages', authorize(PERMISSIONS.PAGES_MANAGE), pageValidation, handleValidationErrors, pageController.createPage);
router.post('/pages/:id/update', authorize(PERMISSIONS.PAGES_MANAGE), pageValidation, handleValidationErrors, pageController.updatePage);
router.post('/pages/:id/delete', authorize(PERMISSIONS.PAGES_MANAGE), pageController.deletePage);

router.get('/services', authorize(PERMISSIONS.SERVICES_MANAGE), serviceController.renderServicesPage);
router.post('/services', authorize(PERMISSIONS.SERVICES_MANAGE), imageUpload.single('image'), validateCsrfToken, serviceValidation, handleValidationErrors, serviceController.createService);
router.post('/services/:id/update', authorize(PERMISSIONS.SERVICES_MANAGE), imageUpload.single('image'), validateCsrfToken, serviceValidation, handleValidationErrors, serviceController.updateService);
router.post('/services/:id/delete', authorize(PERMISSIONS.SERVICES_MANAGE), serviceController.deleteService);

router.get('/products', authorize(PERMISSIONS.PRODUCTS_MANAGE), productController.renderProductsPage);
router.post('/products', authorize(PERMISSIONS.PRODUCTS_MANAGE), imageUpload.fields([{ name: 'logo', maxCount: 1 }, { name: 'images', maxCount: 10 }]), validateCsrfToken, productValidation, handleValidationErrors, productController.createProduct);
router.post('/products/:id/update', authorize(PERMISSIONS.PRODUCTS_MANAGE), imageUpload.fields([{ name: 'logo', maxCount: 1 }, { name: 'images', maxCount: 10 }]), validateCsrfToken, productValidation, handleValidationErrors, productController.updateProduct);
router.post('/products/:id/delete', authorize(PERMISSIONS.PRODUCTS_MANAGE), productController.deleteProduct);

router.get('/portfolio', authorize(PERMISSIONS.PORTFOLIO_MANAGE), projectController.renderProjectsPage);
router.post('/portfolio', authorize(PERMISSIONS.PORTFOLIO_MANAGE), imageUpload.array('images', 10), validateCsrfToken, projectValidation, handleValidationErrors, projectController.createProject);
router.post('/portfolio/:id/update', authorize(PERMISSIONS.PORTFOLIO_MANAGE), imageUpload.array('images', 10), validateCsrfToken, projectValidation, handleValidationErrors, projectController.updateProject);
router.post('/portfolio/:id/delete', authorize(PERMISSIONS.PORTFOLIO_MANAGE), projectController.deleteProject);

router.get('/team', authorize(PERMISSIONS.TEAM_MANAGE), teamController.renderTeamPage);
router.post('/team', authorize(PERMISSIONS.TEAM_MANAGE), imageUpload.single('image'), validateCsrfToken, teamValidation, handleValidationErrors, teamController.createTeamMember);
router.post('/team/:id/update', authorize(PERMISSIONS.TEAM_MANAGE), imageUpload.single('image'), validateCsrfToken, teamValidation, handleValidationErrors, teamController.updateTeamMember);
router.post('/team/:id/delete', authorize(PERMISSIONS.TEAM_MANAGE), teamController.deleteTeamMember);

router.get('/chats', authorize(PERMISSIONS.CHATS_MANAGE), chatController.renderChatsPage);
router.post('/chats/:id/update', authorize(PERMISSIONS.CHATS_MANAGE), chatController.updateChat);

router.get('/blog', authorize(PERMISSIONS.BLOG_MANAGE), blogController.renderBlogPage);
router.post('/blog', authorize(PERMISSIONS.BLOG_MANAGE), imageUpload.single('featured_image'), validateCsrfToken, blogValidation, handleValidationErrors, blogController.createPost);
router.post('/blog/:id/update', authorize(PERMISSIONS.BLOG_MANAGE), imageUpload.single('featured_image'), validateCsrfToken, blogValidation, handleValidationErrors, blogController.updatePost);
router.post('/blog/:id/delete', authorize(PERMISSIONS.BLOG_MANAGE), blogController.deletePost);

router.get('/leads', authorize(PERMISSIONS.LEADS_MANAGE), leadController.renderLeadsPage);
router.post('/leads/:id/update', authorize(PERMISSIONS.LEADS_MANAGE), leadController.updateLead);

router.get('/careers', authorize(PERMISSIONS.CAREERS_MANAGE), careerController.renderCareersPage);
router.post('/careers/jobs', authorize(PERMISSIONS.CAREERS_MANAGE), jobValidation, handleValidationErrors, careerController.createJob);
router.post('/careers/jobs/:id/update', authorize(PERMISSIONS.CAREERS_MANAGE), jobValidation, handleValidationErrors, careerController.updateJob);
router.post('/careers/jobs/:id/delete', authorize(PERMISSIONS.CAREERS_MANAGE), careerController.deleteJob);
router.post('/careers/applications/:id/status', authorize(PERMISSIONS.CAREERS_MANAGE), careerController.updateApplicationStatus);

router.get('/seo', authorize(PERMISSIONS.SEO_MANAGE), seoController.renderSeoPage);
router.post('/seo', authorize(PERMISSIONS.SEO_MANAGE), seoValidation, handleValidationErrors, seoController.upsertSeo);

router.get('/settings', authorize(PERMISSIONS.SETTINGS_MANAGE), settingsController.renderSettingsPage);
router.post('/settings', authorize(PERMISSIONS.SETTINGS_MANAGE), imageUpload.single('logo'), validateCsrfToken, settingsValidation, handleValidationErrors, settingsController.updateSettings);

router.get('/analytics', authorize(PERMISSIONS.ANALYTICS_VIEW), analyticsController.renderAnalyticsPage);
router.post('/analytics/block', authorize(PERMISSIONS.USERS_MANAGE), validateCsrfToken, analyticsController.blockVisitor);
router.post('/analytics/unblock', authorize(PERMISSIONS.USERS_MANAGE), validateCsrfToken, analyticsController.unblockVisitor);

module.exports = router;
