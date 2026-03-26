const { body, validationResult } = require('express-validator');
const seoOgTypes = ['website', 'article', 'profile', 'product', 'business.business'];
const twitterCardTypes = ['summary', 'summary_large_image', 'app', 'player'];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const message = errors.array().map((error) => error.msg).join(' ');
  const wantsJson = req.originalUrl.startsWith('/api/')
    || req.get('x-requested-with') === 'XMLHttpRequest'
    || req.get('accept')?.includes('application/json');

  if (wantsJson) {
    return res.status(422).json({
      message: 'Validation failed.',
      errors: errors.array()
    });
  }

  return res.status(422).render('frontend/pages/error', {
    title: 'Validation error',
    message,
    seo: {
      metaTitle: 'Validation Error',
      metaDescription: message
    }
  });
}

const loginValidation = [
  body('email').isEmail().withMessage('A valid email is required.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
];

const userValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('A valid email is required.'),
  body('role_id').isInt().withMessage('A valid role is required.')
];

const passwordValidation = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
];

const pageValidation = [
  body('title').trim().notEmpty().withMessage('Title is required.'),
  body('slug').optional({ values: 'falsy' }).trim().isSlug().withMessage('Slug must be URL-safe.')
];

const serviceValidation = [
  body('title').trim().notEmpty().withMessage('Service title is required.'),
  body('slug').optional({ values: 'falsy' }).trim().isSlug().withMessage('Slug must be URL-safe.')
];

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required.'),
  body('slug').optional({ values: 'falsy' }).trim().isSlug().withMessage('Slug must be URL-safe.'),
  body('category_id').notEmpty().withMessage('Product category is required.').bail().isInt().withMessage('Product category must be valid.'),
  body('catalog_link').optional({ values: 'falsy' }).isURL().withMessage('Catalog link must be valid.'),
  body('website_link').optional({ values: 'falsy' }).isURL().withMessage('Reference website link must be valid.'),
  body('demo_link').optional({ values: 'falsy' }).isURL().withMessage('Secondary action link must be valid.')
];

const productCategoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required.'),
  body('slug').optional({ values: 'falsy' }).trim().isSlug().withMessage('Slug must be URL-safe.'),
  body('sort_order').optional({ values: 'falsy' }).isInt({ min: 0 }).withMessage('Sort order must be 0 or more.')
];

const projectValidation = [
  body('title').trim().notEmpty().withMessage('Project title is required.'),
  body('slug').optional({ values: 'falsy' }).trim().isSlug().withMessage('Slug must be URL-safe.')
];

const teamValidation = [
  body('name').trim().notEmpty().withMessage('Team member name is required.'),
  body('slug').optional({ values: 'falsy' }).trim().isSlug().withMessage('Slug must be URL-safe.'),
  body('designation').trim().notEmpty().withMessage('Designation is required.'),
  body('linkedin_url').optional({ values: 'falsy' }).isURL().withMessage('LinkedIn URL must be valid.'),
  body('twitter_url').optional({ values: 'falsy' }).isURL().withMessage('Twitter URL must be valid.'),
  body('facebook_url').optional({ values: 'falsy' }).isURL().withMessage('Facebook URL must be valid.')
];

const blogValidation = [
  body('title').trim().notEmpty().withMessage('Blog title is required.'),
  body('slug').optional({ values: 'falsy' }).trim().isSlug().withMessage('Slug must be URL-safe.')
];

const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('A valid email is required.'),
  body('message').trim().notEmpty().withMessage('Message is required.')
];

const b2bEnquiryValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('A valid email is required.'),
  body('company_name').trim().notEmpty().withMessage('Company name is required.'),
  body('selected_products')
    .custom((value) => {
      if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean).length > 0;
      }

      return Boolean(String(value || '').trim());
    })
    .withMessage('Select at least one product.'),
  body('message').trim().notEmpty().withMessage('Inquiry details are required.')
];

const chatValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('A valid email is required.'),
  body('message').trim().notEmpty().withMessage('Message is required.')
];

const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required.'),
  body('slug').optional({ values: 'falsy' }).trim().isSlug().withMessage('Slug must be URL-safe.'),
  body('description').trim().notEmpty().withMessage('Job description is required.')
];

const applicationValidation = [
  body('name').trim().notEmpty().withMessage('Applicant name is required.'),
  body('email').isEmail().withMessage('A valid email is required.'),
  body('job_slug')
    .custom((value, { req }) => Boolean(req.params.slug || value))
    .withMessage('A valid job is required.'),
  body('resume')
    .custom((value, { req }) => Boolean(req.file || value))
    .withMessage('A resume file is required.')
];

const seoValidation = [
  body('page_key').trim().notEmpty().withMessage('Page key is required.'),
  body('og_type').optional({ values: 'falsy' }).isIn(seoOgTypes).withMessage('OpenGraph type must be valid.'),
  body('twitter_card').optional({ values: 'falsy' }).isIn(twitterCardTypes).withMessage('Twitter card must be valid.')
];

const sitewideSeoValidation = [
  body('default_twitter_card').optional({ values: 'falsy' }).isIn(twitterCardTypes).withMessage('Default Twitter card must be valid.')
];

const settingsValidation = [
  body('company_name').trim().notEmpty().withMessage('Company name is required.'),
  body('chat_manager_user_id').optional({ values: 'falsy' }).isInt().withMessage('Chat notification manager must be valid.'),
  body('show_products_menu').optional({ values: 'falsy' }).isIn(['0', '1']).withMessage('Products menu visibility must be valid.')
];

module.exports = {
  handleValidationErrors,
  loginValidation,
  userValidation,
  passwordValidation,
  pageValidation,
  serviceValidation,
  productValidation,
  productCategoryValidation,
  projectValidation,
  teamValidation,
  blogValidation,
  leadValidation,
  b2bEnquiryValidation,
  chatValidation,
  jobValidation,
  applicationValidation,
  seoValidation,
  sitewideSeoValidation,
  settingsValidation
};
