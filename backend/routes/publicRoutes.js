const express = require('express');
const publicController = require('../controllers/publicController');
const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');
const env = require('../config/env');
const { ensureGuest } = require('../middleware/authMiddleware');
const { validateCsrfToken } = require('../middleware/csrfMiddleware');
const { authLimiter } = require('../middleware/rateLimiters');
const { resumeUpload } = require('../middleware/uploadMiddleware');
const {
  handleValidationErrors,
  loginValidation,
  leadValidation,
  chatValidation,
  applicationValidation
} = require('../validators');

const router = express.Router();

router.get('/login', (req, res) => res.redirect('/'));
router.post('/login', (req, res) => res.redirect(303, '/'));
router.get(env.privateLoginPath, ensureGuest, authController.showLogin);
router.post(env.privateLoginPath, ensureGuest, authLimiter, loginValidation, handleValidationErrors, authController.login);
router.post('/logout', authController.logout);

router.get('/', publicController.home);
router.get('/services', publicController.services);
router.get('/services/:slug', publicController.serviceDetail);
router.get('/products', publicController.products);
router.get('/products/:slug', publicController.productDetail);
router.get('/projects', publicController.projects);
router.get('/projects/:slug', publicController.projectDetail);
router.get('/portfolio', (req, res) => res.redirect('/projects'));
router.get('/portfolio/:slug', (req, res) => res.redirect(`/projects/${req.params.slug}`));
router.get('/blog', publicController.blog);
router.get('/blog/:slug', publicController.blogDetail);
router.get('/careers', publicController.careers);
router.get('/careers/:slug', publicController.jobDetail);
router.get('/about-us', publicController.about);
router.get('/about', (req, res) => res.redirect('/about-us'));
router.get('/about-codexwebz', (req, res) => res.redirect('/about-us'));
router.get('/team', publicController.team);
router.get('/team/:slug', publicController.teamProfile);
router.get('/contact', publicController.contact);

router.post('/contact', leadValidation, handleValidationErrors, publicController.submitLead);
router.post('/chat', chatValidation, handleValidationErrors, chatController.submitChat);
router.post(
  '/careers/:slug/apply',
  resumeUpload.single('resume'),
  validateCsrfToken,
  applicationValidation,
  handleValidationErrors,
  publicController.submitApplication
);

router.get('/sitemap.xml', publicController.sitemap);
router.get('/robots.txt', publicController.robots);
router.get('/:slug', publicController.pageDetail);

module.exports = router;
