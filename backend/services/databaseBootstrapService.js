const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const env = require('../config/env');
const { ensureExtendedSchema } = require('./schemaMaintenanceService');

let bootstrapPromise = null;

function splitSchemaSections(schema = '') {
  const marker = /INSERT\s+INTO\s+website_settings\s*\(/i;
  const match = marker.exec(schema);

  if (!match) {
    return {
      structureSql: schema,
      dataSql: ''
    };
  }

  return {
    structureSql: schema.slice(0, match.index),
    dataSql: schema.slice(match.index)
  };
}

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
    const { structureSql, dataSql } = splitSchemaSections(schema);

    if (structureSql.trim()) {
      await connection.query(structureSql);
    }

    await ensureExtendedSchema(connection, env.db.database);

    if (dataSql.trim()) {
      await connection.query(dataSql);
    }
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
  ensureDatabaseInitialized,
  splitSchemaSections
};
