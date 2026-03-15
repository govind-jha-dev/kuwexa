const { query, getOne, execute } = require('../config/database');
const { parseJsonFields, parseMany } = require('../utils/serializers');

async function listAll() {
  const rows = await query('SELECT * FROM seo_settings ORDER BY page_key ASC');
  return parseMany(rows, ['schema_markup']);
}

async function findByPageKey(pageKey) {
  const row = await getOne('SELECT * FROM seo_settings WHERE page_key = ?', [pageKey]);
  return parseJsonFields(row, ['schema_markup']);
}

async function upsert(pageKey, data) {
  await execute(
    `
      INSERT INTO seo_settings (
        page_key, meta_title, meta_description, meta_keywords, focus_keyword, meta_robots,
        slug, schema_markup, og_type, og_title, og_description, og_image, og_image_alt,
        twitter_card, twitter_title, twitter_description, twitter_image, canonical_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        meta_keywords = VALUES(meta_keywords),
        focus_keyword = VALUES(focus_keyword),
        meta_robots = VALUES(meta_robots),
        slug = VALUES(slug),
        schema_markup = VALUES(schema_markup),
        og_type = VALUES(og_type),
        og_title = VALUES(og_title),
        og_description = VALUES(og_description),
        og_image = VALUES(og_image),
        og_image_alt = VALUES(og_image_alt),
        twitter_card = VALUES(twitter_card),
        twitter_title = VALUES(twitter_title),
        twitter_description = VALUES(twitter_description),
        twitter_image = VALUES(twitter_image),
        canonical_url = VALUES(canonical_url)
    `,
    [
      pageKey,
      data.meta_title,
      data.meta_description,
      data.meta_keywords,
      data.focus_keyword,
      data.meta_robots,
      data.slug,
      data.schema_markup,
      data.og_type,
      data.og_title,
      data.og_description,
      data.og_image,
      data.og_image_alt,
      data.twitter_card,
      data.twitter_title,
      data.twitter_description,
      data.twitter_image,
      data.canonical_url
    ]
  );

  return findByPageKey(pageKey);
}

module.exports = {
  listAll,
  findByPageKey,
  upsert
};
