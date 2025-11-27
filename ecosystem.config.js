module.exports = {
  apps: [
    {
      name: 'faltuverse-backend',
      cwd: '/var/www/faltuverse/backend',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      env_file: '/var/www/faltuverse/backend/.env',
      error_file: '/var/www/faltuverse/logs/backend-error.log',
      out_file: '/var/www/faltuverse/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'faltuverse-frontend',
      cwd: '/var/www/faltuverse/frontend',
      script: 'npm',
      args: 'run dev -- --host 0.0.0.0',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        VITE_API_URL: 'https://faltuverse.cloud',
        VITE_GOOGLE_CLIENT_ID: '182449420217-nus093tc0cuod8mm56i6qtj89ceuvf6f.apps.googleusercontent.com'
      },
      error_file: '/var/www/faltuverse/logs/frontend-error.log',
      out_file: '/var/www/faltuverse/logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    }
  ]
};
