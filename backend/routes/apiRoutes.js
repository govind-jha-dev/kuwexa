const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const pageController = require('../controllers/pageController');
const serviceController = require('../controllers/serviceController');
const projectController = require('../controllers/projectController');
const teamController = require('../controllers/teamController');
const chatController = require('../controllers/chatController');
const blogController = require('../controllers/blogController');
const leadController = require('../controllers/leadController');
const careerController = require('../controllers/careerController');
const seoController = require('../controllers/seoController');
const settingsController = require('../controllers/settingsController');
const analyticsController = require('../controllers/analyticsController');
const publicController = require('../controllers/publicController');
const { requireAuth } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');
const { PERMISSIONS } = require('../config/permissions');
const { imageUpload, resumeUpload } = require('../middleware/uploadMiddleware');
const {
  handleValidationErrors,
  loginValidation,
  userValidation,
  passwordValidation,
  pageValidation,
  serviceValidation,
  projectValidation,
  teamValidation,
  blogValidation,
  leadValidation,
  chatValidation,
  jobValidation,
  applicationValidation,
  seoValidation,
  settingsValidation
} = require('../validators');

const router = express.Router();

router.post('/auth/login', loginValidation, handleValidationErrors, authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', requireAuth, authController.me);

router.get('/public/services', serviceController.apiList);
router.get('/public/projects', projectController.apiList);
router.get('/public/team', teamController.publicApiList);
router.get('/public/blog', blogController.apiList);
router.get('/public/careers', careerController.apiList);
router.post('/leads', leadValidation, handleValidationErrors, publicController.submitLead);
router.post('/chat', chatValidation, handleValidationErrors, chatController.submitChat);
router.post('/applications', resumeUpload.single('resume'), applicationValidation, handleValidationErrors, publicController.submitApplication);

router.get('/users', requireAuth, authorize(PERMISSIONS.USERS_MANAGE), userController.apiList);
router.post('/users', requireAuth, authorize(PERMISSIONS.USERS_MANAGE), userValidation, passwordValidation, handleValidationErrors, userController.createUser);
router.put('/users/:id', requireAuth, authorize(PERMISSIONS.USERS_MANAGE), userValidation, handleValidationErrors, userController.updateUser);
router.patch('/users/:id/status', requireAuth, authorize(PERMISSIONS.USERS_MANAGE), userController.updateStatus);

router.get('/pages', requireAuth, authorize(PERMISSIONS.PAGES_MANAGE), pageController.apiList);
router.post('/pages', requireAuth, authorize(PERMISSIONS.PAGES_MANAGE), pageValidation, handleValidationErrors, pageController.createPage);
router.put('/pages/:id', requireAuth, authorize(PERMISSIONS.PAGES_MANAGE), pageValidation, handleValidationErrors, pageController.updatePage);
router.delete('/pages/:id', requireAuth, authorize(PERMISSIONS.PAGES_MANAGE), pageController.deletePage);

router.get('/services', requireAuth, authorize(PERMISSIONS.SERVICES_MANAGE), serviceController.apiList);
router.post('/services', requireAuth, authorize(PERMISSIONS.SERVICES_MANAGE), imageUpload.single('image'), serviceValidation, handleValidationErrors, serviceController.createService);
router.put('/services/:id', requireAuth, authorize(PERMISSIONS.SERVICES_MANAGE), imageUpload.single('image'), serviceValidation, handleValidationErrors, serviceController.updateService);
router.delete('/services/:id', requireAuth, authorize(PERMISSIONS.SERVICES_MANAGE), serviceController.deleteService);

router.get('/projects', requireAuth, authorize(PERMISSIONS.PORTFOLIO_MANAGE), projectController.apiList);
router.post('/projects', requireAuth, authorize(PERMISSIONS.PORTFOLIO_MANAGE), imageUpload.array('images', 10), projectValidation, handleValidationErrors, projectController.createProject);
router.put('/projects/:id', requireAuth, authorize(PERMISSIONS.PORTFOLIO_MANAGE), imageUpload.array('images', 10), projectValidation, handleValidationErrors, projectController.updateProject);
router.delete('/projects/:id', requireAuth, authorize(PERMISSIONS.PORTFOLIO_MANAGE), projectController.deleteProject);

router.get('/team', requireAuth, authorize(PERMISSIONS.TEAM_MANAGE), teamController.apiList);
router.post('/team', requireAuth, authorize(PERMISSIONS.TEAM_MANAGE), imageUpload.single('image'), teamValidation, handleValidationErrors, teamController.createTeamMember);
router.put('/team/:id', requireAuth, authorize(PERMISSIONS.TEAM_MANAGE), imageUpload.single('image'), teamValidation, handleValidationErrors, teamController.updateTeamMember);
router.delete('/team/:id', requireAuth, authorize(PERMISSIONS.TEAM_MANAGE), teamController.deleteTeamMember);

router.get('/chats', requireAuth, authorize(PERMISSIONS.CHATS_MANAGE), chatController.apiList);
router.patch('/chats/:id', requireAuth, authorize(PERMISSIONS.CHATS_MANAGE), chatController.updateChat);

router.get('/blog', requireAuth, authorize(PERMISSIONS.BLOG_MANAGE), blogController.apiList);
router.post('/blog', requireAuth, authorize(PERMISSIONS.BLOG_MANAGE), imageUpload.single('featured_image'), blogValidation, handleValidationErrors, blogController.createPost);
router.put('/blog/:id', requireAuth, authorize(PERMISSIONS.BLOG_MANAGE), imageUpload.single('featured_image'), blogValidation, handleValidationErrors, blogController.updatePost);
router.delete('/blog/:id', requireAuth, authorize(PERMISSIONS.BLOG_MANAGE), blogController.deletePost);

router.get('/dashboard/leads', requireAuth, authorize(PERMISSIONS.LEADS_MANAGE), leadController.apiList);
router.patch('/dashboard/leads/:id', requireAuth, authorize(PERMISSIONS.LEADS_MANAGE), leadController.updateLead);

router.get('/careers', requireAuth, authorize(PERMISSIONS.CAREERS_MANAGE), careerController.apiList);
router.post('/careers/jobs', requireAuth, authorize(PERMISSIONS.CAREERS_MANAGE), jobValidation, handleValidationErrors, careerController.createJob);
router.put('/careers/jobs/:id', requireAuth, authorize(PERMISSIONS.CAREERS_MANAGE), jobValidation, handleValidationErrors, careerController.updateJob);
router.delete('/careers/jobs/:id', requireAuth, authorize(PERMISSIONS.CAREERS_MANAGE), careerController.deleteJob);
router.patch('/careers/applications/:id', requireAuth, authorize(PERMISSIONS.CAREERS_MANAGE), careerController.updateApplicationStatus);

router.get('/seo', requireAuth, authorize(PERMISSIONS.SEO_MANAGE), seoController.apiList);
router.post('/seo', requireAuth, authorize(PERMISSIONS.SEO_MANAGE), seoValidation, handleValidationErrors, seoController.upsertSeo);

router.get('/settings', requireAuth, authorize(PERMISSIONS.SETTINGS_MANAGE), settingsController.apiShow);
router.put('/settings', requireAuth, authorize(PERMISSIONS.SETTINGS_MANAGE), settingsValidation, handleValidationErrors, settingsController.updateSettings);

router.get('/analytics', requireAuth, authorize(PERMISSIONS.ANALYTICS_VIEW), analyticsController.apiOverview);

module.exports = router;
