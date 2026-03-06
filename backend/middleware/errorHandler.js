function notFoundHandler(req, res) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ message: 'Route not found.' });
  }

  return res.status(404).render('frontend/pages/error', {
    title: 'Page not found',
    message: 'The page you requested does not exist.',
    seo: {
      metaTitle: 'Page Not Found',
      metaDescription: 'The requested page could not be found.'
    }
  });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'An unexpected error occurred.';

  if (statusCode >= 500) {
    console.error(error);
  }

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(statusCode).json({ message });
  }

  return res.status(statusCode).render('frontend/pages/error', {
    title: 'Something went wrong',
    message,
    seo: {
      metaTitle: 'Application Error',
      metaDescription: 'An application error occurred.'
    }
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
