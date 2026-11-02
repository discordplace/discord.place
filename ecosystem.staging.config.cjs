const path = require('node:path');

const root = __dirname;
const binPath = `${path.dirname(process.execPath)}:${process.env.PATH}`;

module.exports = {
  apps: [
    {
      name: 'discord.place-staging',
      cwd: path.join(root, 'client'),
      script: '/usr/bin/doppler',
      args: ['run', '--project', 'discord-place', '--config', 'stg', '--', 'pnpm', 'start'],
      exec_interpreter: 'none',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      time: true,
      merge_logs: true,
      kill_timeout: 10_000,
      env: {
        NODE_ENV: 'production',
        PATH: binPath
      }
    },
    {
      name: 'api.discord.place-staging',
      cwd: path.join(root, 'server'),
      script: '/usr/bin/doppler',
      args: ['run', '--project', 'discord-place', '--config', 'stg', '--', 'pnpm', 'start:staging'],
      exec_interpreter: 'none',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      time: true,
      merge_logs: true,
      kill_timeout: 10_000,
      env: {
        NODE_ENV: 'production',
        PATH: binPath
      }
    }
  ]
};
