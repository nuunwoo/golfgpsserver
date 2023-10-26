module.exports = {
  apps: [
    {
      name: 'client',
      script: './client/index.js',
      instances: 3,
      exec_mode: 'cluster',
      merge_logs: true,
      autorestart: true,
      watch: false,
      listen_timeout: 50000,
      kill_timeout: 5000,
    },
    {
      name: 'server',
      script: './server/app.js',
      instances: 1,
      exec_mode: 'cluster',
      merge_logs: true,
      autorestart: true,
      watch: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
    },
  ],
};
