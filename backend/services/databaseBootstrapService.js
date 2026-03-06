const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const env = require('../config/env');
const { ensureTeamMemberColumns, ensureWebsiteSettingColumns } = require('./schemaMaintenanceService');

let bootstrapPromise = null;

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.database}\``);
    await connection.changeUser({ database: env.db.database });

    const schemaPath = path.join(env.rootDir, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schema);
    await ensureTeamMemberColumns(connection, env.db.database);
    await ensureWebsiteSettingColumns(connection, env.db.database);
  } finally {
    await connection.end();
  }
}

function ensureDatabaseInitialized() {
  if (!bootstrapPromise) {
    bootstrapPromise = initializeDatabase().catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }

  return bootstrapPromise;
}

module.exports = {
  ensureDatabaseInitialized
};
