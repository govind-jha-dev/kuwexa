const blogModel = require('../models/blogModel');
const { renderModule, getDashboardBasePath } = require('./dashboardController');
const { sanitizePlainText, sanitizeRichText, makeSlug, toJson } = require('../utils/content');
const { splitCsv } = require('../utils/serializers');
const { registerAsset } = require('../services/mediaAssetService');

function respond(req, res, payload, redirectUrl) {
  if (req.originalUrl.startsWith('/api/')) {
    return res.json(payload);
  }

  return res.redirect(redirectUrl);
}

function imagePath(file) {
  return file ? `/uploads/images/${file.filename}` : null;
}

async function renderBlogPage(req, res) {
  const posts = await blogModel.listAll();
  const editingPost = posts.find((item) => item.id === Number(req.query.edit)) || null;
  const basePath = getDashboardBasePath(req);

  return renderModule(req, res, {
    pageTitle: 'Blog CMS',
    activeMenu: 'Blog',
    stats: [
      { label: 'Blog Posts', value: posts.length },
      { label: 'Published', value: posts.filter((post) => post.status === 'published').length }
    ],
    form: {
      title: editingPost ? `Edit ${editingPost.title}` : 'Create Blog Post',
      action: editingPost ? `${basePath}/blog/${editingPost.id}/update` : `${basePath}/blog`,
      submitLabel: editingPost ? 'Update Post' : 'Create Post',
      enctype: 'multipart/form-data',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true, value: editingPost?.title || '' },
        { name: 'slug', label: 'Slug', type: 'text', value: editingPost?.slug || '' },
        { name: 'category', label: 'Category', type: 'text', value: editingPost?.category || '' },
        { name: 'tags', label: 'Tags (comma separated)', type: 'text', value: editingPost?.tags?.join(', ') || '' },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea', value: editingPost?.excerpt || '' },
        { name: 'content', label: 'Content', type: 'richtext', value: editingPost?.content || '' },
        { name: 'featured_image', label: 'Featured Image', type: 'file', accept: 'image/*' },
        { name: 'meta_title', label: 'Meta Title', type: 'text', value: editingPost?.meta_title || '' },
        { name: 'meta_description', label: 'Meta Description', type: 'textarea', value: editingPost?.meta_description || '' },
        { name: 'meta_keywords', label: 'Meta Keywords', type: 'text', value: editingPost?.meta_keywords || '' },
        { name: 'og_title', label: 'OpenGraph Title', type: 'text', value: editingPost?.og_title || '' },
        { name: 'og_description', label: 'OpenGraph Description', type: 'textarea', value: editingPost?.og_description || '' },
        { name: 'canonical_url', label: 'Canonical URL', type: 'text', value: editingPost?.canonical_url || '' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          value: editingPost?.status || 'draft',
          options: [
            { label: 'draft', value: 'draft' },
            { label: 'published', value: 'published' }
          ]
        }
      ]
    },
    table: {
      title: 'Blog Posts',
      description: 'Create, edit, publish, and optimize blog content.',
      columns: [
        { label: 'Title', key: 'title' },
        { label: 'Category', key: 'category' },
        { label: 'Author', key: 'author_name' },
        { label: 'Status', key: 'status' },
        { label: 'Updated', key: 'updated_at', type: 'date' }
      ],
      rows: posts,
      rowActions: (post) => `
        <div class="flex flex-wrap gap-2">
          <a class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700" href="${basePath}/blog?edit=${post.id}">Edit</a>
          <form method="post" action="${basePath}/blog/${post.id}/delete" class="inline-flex">
            <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
            <button class="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white" type="submit">Delete</button>
          </form>
        </div>
      `
    }
  });
}

async function createPost(req, res) {
  const title = sanitizePlainText(req.body.title);
  const status = sanitizePlainText(req.body.status) || 'draft';
  const post = await blogModel.createPost({
    title,
    slug: sanitizePlainText(req.body.slug) || makeSlug(title),
    excerpt: sanitizePlainText(req.body.excerpt),
    content: sanitizeRichText(req.body.content),
    author_id: req.user.id,
    category: sanitizePlainText(req.body.category),
    tags: toJson(splitCsv(req.body.tags)),
    featured_image: imagePath(req.file),
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords),
    schema_markup: null,
    og_title: sanitizePlainText(req.body.og_title),
    og_description: sanitizePlainText(req.body.og_description),
    canonical_url: sanitizePlainText(req.body.canonical_url),
    status,
    published_at: status === 'published' ? new Date() : null
  });

  await registerAsset(post?.featured_image, {
    title: post?.title,
    altText: `${post?.title || 'Kuwexa article'} featured image`,
    sourceModule: 'Blog'
  });

  return respond(req, res, { message: 'Post created successfully.', post }, `${getDashboardBasePath(req)}/blog?success=Post%20created%20successfully.`);
}

async function updatePost(req, res) {
  const title = sanitizePlainText(req.body.title);
  const status = sanitizePlainText(req.body.status) || 'draft';
  const updates = {
    title,
    slug: sanitizePlainText(req.body.slug) || makeSlug(title),
    excerpt: sanitizePlainText(req.body.excerpt),
    content: sanitizeRichText(req.body.content),
    category: sanitizePlainText(req.body.category),
    tags: toJson(splitCsv(req.body.tags)),
    meta_title: sanitizePlainText(req.body.meta_title),
    meta_description: sanitizePlainText(req.body.meta_description),
    meta_keywords: sanitizePlainText(req.body.meta_keywords),
    og_title: sanitizePlainText(req.body.og_title),
    og_description: sanitizePlainText(req.body.og_description),
    canonical_url: sanitizePlainText(req.body.canonical_url),
    status
  };

  if (status === 'published') {
    updates.published_at = new Date();
  }

  if (req.file) {
    updates.featured_image = imagePath(req.file);
  }

  const post = await blogModel.updatePost(Number(req.params.id), updates);
  await registerAsset(post?.featured_image, {
    title: post?.title,
    altText: `${post?.title || 'Kuwexa article'} featured image`,
    sourceModule: 'Blog'
  });
  return respond(req, res, { message: 'Post updated successfully.', post }, `${getDashboardBasePath(req)}/blog?success=Post%20updated%20successfully.`);
}

async function deletePost(req, res) {
  await blogModel.deletePost(Number(req.params.id));
  return respond(req, res, { message: 'Post deleted successfully.' }, `${getDashboardBasePath(req)}/blog?success=Post%20deleted%20successfully.`);
}

async function apiList(req, res) {
  const posts = await blogModel.listAll();
  return res.json({ posts });
}

module.exports = {
  renderBlogPage,
  createPost,
  updatePost,
  deletePost,
  apiList
};
