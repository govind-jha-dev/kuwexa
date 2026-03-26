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
  b2bEnquiryValidation,
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
router.get('/divisions', publicController.divisions);
router.get('/divisions/:slug', publicController.divisionDetail);
router.get('/b2b', publicController.b2b);
router.get('/b2b/products/:slug', publicController.b2bProductDetail);
router.get('/services', (req, res) => res.redirect('/divisions/codexwebz'));
router.get('/services/:slug', (req, res) => res.redirect('/divisions/codexwebz'));
router.get('/products', (req, res) => res.redirect('/b2b'));
router.get('/products/:slug', (req, res) => res.redirect(`/b2b/products/${req.params.slug}`));
router.get('/portfolio', (req, res) => res.redirect('/divisions'));
router.get('/portfolio/:slug', (req, res) => res.redirect('/divisions'));
router.get('/projects', (req, res) => res.redirect('/divisions'));
router.get('/projects/:slug', (req, res) => res.redirect('/divisions'));
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
router.post('/b2b/enquiry', b2bEnquiryValidation, handleValidationErrors, publicController.submitB2BEnquiry);
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
