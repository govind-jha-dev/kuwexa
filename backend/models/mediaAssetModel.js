const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');

async function listAll() {
  return query('SELECT * FROM media_assets ORDER BY updated_at DESC, id DESC');
}

async function findById(id) {
  return getOne('SELECT * FROM media_assets WHERE id = ?', [id]);
}

async function getAltMap() {
  const rows = await query('SELECT file_path, alt_text FROM media_assets WHERE alt_text IS NOT NULL AND alt_text <> ""');
  return rows.reduce((map, row) => {
    map[row.file_path] = row.alt_text;
    return map;
  }, {});
}

async function registerAsset(data) {
  if (!data?.file_path) {
    return null;
  }

  await execute(
    `
      INSERT INTO media_assets (file_path, title, alt_text, source_module)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = COALESCE(NULLIF(VALUES(title), ''), title),
        source_module = COALESCE(NULLIF(VALUES(source_module), ''), source_module),
        alt_text = CASE
          WHEN media_assets.alt_text IS NULL OR media_assets.alt_text = ''
            THEN COALESCE(NULLIF(VALUES(alt_text), ''), media_assets.alt_text)
          ELSE media_assets.alt_text
        END
    `,
    [
      data.file_path,
      data.title || null,
      data.alt_text || null,
      data.source_module || null
    ]
  );

  return getOne('SELECT * FROM media_assets WHERE file_path = ?', [data.file_path]);
}

async function registerMany(items = []) {
  const validItems = items.filter((item) => item?.file_path);

  for (const item of validItems) {
    await registerAsset(item);
  }

  return validItems.length;
}

async function updateAsset(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE media_assets SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  return findById(id);
}

module.exports = {
  listAll,
  findById,
  getAltMap,
  registerAsset,
  registerMany,
  updateAsset
};
