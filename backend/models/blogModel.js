const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');
const { parseJsonFields, parseMany } = require('../utils/serializers');

async function listAll() {
  const rows = await query(
    `
      SELECT blog_posts.*, users.name AS author_name
      FROM blog_posts
      LEFT JOIN users ON users.id = blog_posts.author_id
      ORDER BY blog_posts.updated_at DESC
    `
  );
  return parseMany(rows, ['tags', 'schema_markup']);
}

async function listPublished() {
  const rows = await query(
    `
      SELECT blog_posts.*, users.name AS author_name
      FROM blog_posts
      LEFT JOIN users ON users.id = blog_posts.author_id
      WHERE blog_posts.status = 'published'
      ORDER BY COALESCE(blog_posts.published_at, blog_posts.updated_at) DESC
    `
  );
  return parseMany(rows, ['tags', 'schema_markup']);
}

async function latest(limit = 3) {
  const rows = await query(
    `
      SELECT blog_posts.*, users.name AS author_name
      FROM blog_posts
      LEFT JOIN users ON users.id = blog_posts.author_id
      WHERE blog_posts.status = 'published'
      ORDER BY COALESCE(blog_posts.published_at, blog_posts.updated_at) DESC
      LIMIT ?
    `,
    [Number(limit)]
  );
  return parseMany(rows, ['tags', 'schema_markup']);
}

async function findBySlug(slug) {
  const row = await getOne(
    `
      SELECT blog_posts.*, users.name AS author_name
      FROM blog_posts
      LEFT JOIN users ON users.id = blog_posts.author_id
      WHERE blog_posts.slug = ?
    `,
    [slug]
  );
  return parseJsonFields(row, ['tags', 'schema_markup']);
}

async function countAll() {
  const row = await getOne('SELECT COUNT(*) AS total FROM blog_posts');
  return row?.total || 0;
}

async function createPost(data) {
  const result = await execute(
    `
      INSERT INTO blog_posts (
        title, slug, excerpt, content, author_id, category, tags, featured_image,
        meta_title, meta_description, schema_markup, og_title, og_description, canonical_url, status, published_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.title,
      data.slug,
      data.excerpt,
      data.content,
      data.author_id,
      data.category,
      data.tags,
      data.featured_image,
      data.meta_title,
      data.meta_description,
      data.schema_markup,
      data.og_title,
      data.og_description,
      data.canonical_url,
      data.status,
      data.published_at
    ]
  );

  const row = await getOne('SELECT * FROM blog_posts WHERE id = ?', [result.insertId]);
  return parseJsonFields(row, ['tags', 'schema_markup']);
}

async function updatePost(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE blog_posts SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  const row = await getOne('SELECT * FROM blog_posts WHERE id = ?', [id]);
  return parseJsonFields(row, ['tags', 'schema_markup']);
}

async function deletePost(id) {
  return execute('DELETE FROM blog_posts WHERE id = ?', [id]);
}

module.exports = {
  listAll,
  listPublished,
  latest,
  findBySlug,
  countAll,
  createPost,
  updatePost,
  deletePost
};
