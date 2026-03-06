module.exports = {
  apps: [
    {
      name: 'codexwebz-platform',
      script: 'backend/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    }
  ]
};
