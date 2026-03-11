const { query, getOne, execute } = require('../config/database');
const { buildUpdateClause } = require('../utils/sql');

function groupMembers(rows = []) {
  return {
    leadership: rows.filter((member) => member.member_type === 'leadership'),
    employees: rows.filter((member) => member.member_type === 'employee')
  };
}

async function listAll() {
  return query(
    `
      SELECT *
      FROM team_members
      ORDER BY
        CASE member_type WHEN 'leadership' THEN 0 ELSE 1 END,
        sort_order ASC,
        updated_at DESC
    `
  );
}

async function listActive() {
  return query(
    `
      SELECT *
      FROM team_members
      WHERE status = 'active'
      ORDER BY
        CASE member_type WHEN 'leadership' THEN 0 ELSE 1 END,
        sort_order ASC,
        updated_at DESC
    `
  );
}

async function listGroupedActive() {
  return groupMembers(await listActive());
}

async function findBySlug(slug) {
  return getOne(
    `
      SELECT *
      FROM team_members
      WHERE slug = ?
    `,
    [slug]
  );
}

async function countAll() {
  const row = await getOne('SELECT COUNT(*) AS total FROM team_members');
  return row?.total || 0;
}

async function createTeamMember(data) {
  const result = await execute(
    `
      INSERT INTO team_members (
        name, slug, member_type, designation, department, short_bio, bio,
        email, phone, image, linkedin_url, twitter_url, facebook_url,
        meta_title, meta_description, meta_keywords, status, sort_order
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.name,
      data.slug,
      data.member_type,
      data.designation,
      data.department,
      data.short_bio,
      data.bio,
      data.email,
      data.phone,
      data.image,
      data.linkedin_url,
      data.twitter_url,
      data.facebook_url,
      data.meta_title,
      data.meta_description,
      data.meta_keywords,
      data.status,
      data.sort_order
    ]
  );

  return getOne('SELECT * FROM team_members WHERE id = ?', [result.insertId]);
}

async function updateTeamMember(id, data) {
  const updates = buildUpdateClause(data);
  if (updates.clause) {
    await execute(`UPDATE team_members SET ${updates.clause} WHERE id = ?`, [...updates.values, id]);
  }

  return getOne('SELECT * FROM team_members WHERE id = ?', [id]);
}

async function deleteTeamMember(id) {
  return execute('DELETE FROM team_members WHERE id = ?', [id]);
}

module.exports = {
  groupMembers,
  listAll,
  listActive,
  listGroupedActive,
  findBySlug,
  countAll,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
};
