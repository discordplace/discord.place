const { spawn } = require('node:child_process');

const command = process.argv[2];
const port = Number(process.env.CLIENT_PORT || process.env.NEXT_PUBLIC_PORT || 5000);

if (!['dev', 'start'].includes(command)) {
  console.error('Usage: node scripts/next.cjs <dev|start>');
  process.exit(1);
}

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  console.error('CLIENT_PORT must be a valid port number.');
  process.exit(1);
}

const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), command, '-p', String(port)], {
  env: { ...process.env, PORT: String(port) },
  stdio: 'inherit'
});

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));

child.on('exit', code => process.exit(code ?? 0));
