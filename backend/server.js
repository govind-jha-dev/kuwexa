const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/database');
const { ensureDir } = require('./middleware/uploadMiddleware');
const { ensureDatabaseInitialized } = require('./services/databaseBootstrapService');

ensureDir(env.uploadDir);

async function start() {
  try {
    await ensureDatabaseInitialized();
    await pool.query('SELECT 1');
    app.listen(env.port, () => {
      console.log(`CodexWebz platform listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
