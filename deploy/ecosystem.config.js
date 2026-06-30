// PM2 process manager config for VERTEX ERP (production)
// Usage: pm2 start deploy/ecosystem.config.js
//        pm2 reload deploy/ecosystem.config.js

const path = require('path');
const ROOT = path.resolve(__dirname, '..');

module.exports = {
  apps: [
    {
      name: 'vertex-api',
      cwd: path.join(ROOT, 'apps/api'),
      script: 'dist/index.js',
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '300M',
      out_file: '/var/log/vertex/api.out.log',
      error_file: '/var/log/vertex/api.error.log',
      time: true,
    },
    {
      name: 'vertex-web',
      cwd: path.join(ROOT, 'apps/web'),
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
        API_INTERNAL_URL: 'http://127.0.0.1:4000',
      },
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '400M',
      out_file: '/var/log/vertex/web.out.log',
      error_file: '/var/log/vertex/web.error.log',
      time: true,
    },
  ],
};
