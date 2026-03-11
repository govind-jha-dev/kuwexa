const { body, validationResult } = require('express-validator');

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
  body('slug').optional({ values: 'falsy' }).trim().isSlug().withMessage('Slug must be URL-safe.')
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
  body('page_key').trim().notEmpty().withMessage('Page key is required.')
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
  projectValidation,
  teamValidation,
  blogValidation,
  leadValidation,
  chatValidation,
  jobValidation,
  applicationValidation,
  seoValidation,
  settingsValidation
};
