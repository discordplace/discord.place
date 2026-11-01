const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'shared', 'config.json');
const TARGETS = [
  path.join(ROOT, 'client', 'config', 'shared.generated.json'),
  path.join(ROOT, 'server', 'shared.generated.json')
];

const check = process.argv.includes('--check');
const source = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
const content = `${JSON.stringify(source, null, 2)}\n`;
let failed = false;

for (const target of TARGETS) {
  if (check) {
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';

    if (current !== content) {
      console.error(`Out of date: ${path.relative(ROOT, target)}`);
      failed = true;
    }
  } else {
    fs.writeFileSync(target, content);
    console.log(`Updated ${path.relative(ROOT, target)}`);
  }
}

if (check) {
  if (failed) {
    console.error('Run pnpm sync:shared to update the generated files.');
    process.exit(1);
  }

  console.log('Shared config is up to date.');
}
