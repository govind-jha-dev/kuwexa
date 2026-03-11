const fs = require('fs');
const path = require('path');
const multer = require('multer');
const env = require('../config/env');

function ensureDir(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function createStorage(folderName) {
  const targetDir = path.join(env.uploadDir, folderName);
  ensureDir(targetDir);

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, targetDir),
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-');
      cb(null, `${Date.now()}-${safeName}`);
    }
  });
}

function fileFilter(allowedTypes) {
  return (req, file, cb) => {
    const mimeType = String(file.mimetype || '').toLowerCase();
    const matchesPattern = allowedTypes.some((type) =>
      type.endsWith('/*')
        ? mimeType.startsWith(type.slice(0, -1))
        : type === mimeType
    );

    const extension = path.extname(file.originalname || '').toLowerCase();
    const allowedImageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.jfif']);
    const matchesExtension = allowedTypes.includes('image/*') && allowedImageExtensions.has(extension);

    if (matchesPattern || matchesExtension) {
      return cb(null, true);
    }

    return cb(new Error('Unsupported file type.'));
  };
}

const baseConfig = {
  limits: {
    fileSize: env.maxFileSizeBytes
  }
};

const imageUpload = multer({
  ...baseConfig,
  storage: createStorage('images'),
  fileFilter: fileFilter(['image/*'])
});

const resumeUpload = multer({
  ...baseConfig,
  storage: createStorage('resumes'),
  fileFilter: fileFilter([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ])
});

module.exports = {
  imageUpload,
  resumeUpload,
  ensureDir
};
