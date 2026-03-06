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
        page_key, meta_title, meta_description, slug, schema_markup, og_title, og_description, canonical_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        slug = VALUES(slug),
        schema_markup = VALUES(schema_markup),
        og_title = VALUES(og_title),
        og_description = VALUES(og_description),
        canonical_url = VALUES(canonical_url)
    `,
    [
      pageKey,
      data.meta_title,
      data.meta_description,
      data.slug,
      data.schema_markup,
      data.og_title,
      data.og_description,
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
