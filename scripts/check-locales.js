const fs = require('node:fs');
const path = require('node:path');
const { parseTree } = require('jsonc-parser');

const ROOT = path.resolve(__dirname, '..');

const TARGETS = [
  {
    codeDir: path.join(ROOT, 'client'),
    codeRoots: ['app', 'lib', 'stores', 'config'],
    extensions: ['.js', '.jsx'],
    localeDir: path.join(ROOT, 'client', 'locales'),
    name: 'client'
  },
  {
    codeDir: path.join(ROOT, 'server', 'src'),
    codeRoots: ['.'],
    extensions: ['.js'],
    localeDir: path.join(ROOT, 'server', 'src', 'locales'),
    name: 'server'
  }
];

const IGNORED_DIRECTORIES = new Set(['node_modules', '.next', '.git', 'locales', 'dist', 'build']);
const IGNORED_FILES = new Set(['package-lock.json', 'pnpm-lock.yaml']);

function walk(directory, extensions, files = []) {
  if (!fs.existsSync(directory)) return files;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (IGNORED_FILES.has(entry.name)) continue;

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) continue;

      walk(fullPath, extensions, files);
    } else if (extensions.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function flattenKeys(value, prefix, keys) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => flattenKeys(item, `${prefix}.${index}`, keys));

    return;
  }

  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      flattenKeys(child, prefix ? `${prefix}.${key}` : key, keys);
    }

    return;
  }

  keys.add(prefix);
}

function readLocaleKeys(file) {
  const keys = new Set();
  const content = JSON.parse(fs.readFileSync(file, 'utf8'));

  flattenKeys(content, '', keys);

  return keys;
}

function findDuplicateKeys(file) {
  const duplicates = [];
  const content = fs.readFileSync(file, 'utf8');
  const tree = parseTree(content);

  function visit(node, currentPath) {
    if (!node) return;

    if (node.type === 'object') {
      const seen = new Set();

      for (let index = 0; index < node.children.length; index += 2) {
        const property = node.children[index];
        const key = property.children[0].value;

        if (seen.has(key)) duplicates.push([...currentPath, key].join('.'));
        seen.add(key);

        visit(property.children[1], [...currentPath, key]);
      }
    } else if (node.type === 'array') {
      node.children.forEach((child, index) => visit(child, [...currentPath, index]));
    }
  }

  visit(tree, []);

  return duplicates;
}

function collectUsedKeys(files) {
  const used = new Set();
  const getLocalizedKeys = new Set();
  const dynamicPrefixes = new Set();
  const dynamicSuffixes = new Set();
  const unresolved = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(ROOT, file);

    const staticCallPattern = /(?:\b(?:i18n|i18next)\.)?\b(?:t|translate)\(\s*(['"])((?:\\.|(?!\1)[^\\])*)\1/g;
    let match = null;

    while ((match = staticCallPattern.exec(content)) !== null) {
      used.add(match[2]);
    }

    const templateCallPattern = /(?:\b(?:i18n|i18next)\.)?\b(?:t|translate)\(\s*`([^`]*)`/g;

    while ((match = templateCallPattern.exec(content)) !== null) {
      const template = match[1];
      const interpolationIndex = template.indexOf('${');

      if (interpolationIndex === -1) {
        used.add(template);
      } else {
        const prefix = template.slice(0, interpolationIndex);
        const suffix = template.slice(template.lastIndexOf('}') + 1);

        if (prefix) dynamicPrefixes.add(prefix);
        if (suffix) dynamicSuffixes.add(suffix);
        if (!prefix && !suffix) unresolved.push(`${relativePath}: dynamic template literal`);
      }
    }

    const localizedCommandPattern = /\bgetLocalizedCommand\(\s*(['"])((?:\\.|(?!\1)[^\\])*)\1\s*\)/g;

    while ((match = localizedCommandPattern.exec(content)) !== null) {
      getLocalizedKeys.add(`commands.${match[2]}.name`);
      getLocalizedKeys.add(`commands.${match[2]}.description`);
      used.add(`commands.${match[2]}.name`);
      used.add(`commands.${match[2]}.description`);
    }

    const unresolvedPattern = /(?:\b(?:i18n|i18next)\.)?\b(?:t|translate)\(\s*([A-Za-z_$][\w$.[\]'"]*)\s*(?:,|\))/g;

    while ((match = unresolvedPattern.exec(content)) !== null) {
      if (!relativePath.replaceAll('\\', '/').includes('/utils/localization/')) {
        unresolved.push(`${relativePath}: ${match[1]}`);
      }
    }
  }

  return { dynamicPrefixes, dynamicSuffixes, getLocalizedKeys, unresolved, used };
}

function isUsed(key, used, dynamicPrefixes, dynamicSuffixes) {
  if (used.has(key)) return true;

  for (const prefix of dynamicPrefixes) {
    if (prefix && key.startsWith(prefix)) return true;
  }

  for (const suffix of dynamicSuffixes) {
    if (suffix && key.endsWith(suffix)) return true;
  }

  return false;
}

function editDistance(first, second) {
  const rows = [];

  for (let index = 0; index <= first.length; index++) {
    rows[index] = [index];
  }

  for (let index = 0; index <= second.length; index++) {
    rows[0][index] = index;
  }

  for (let firstIndex = 1; firstIndex <= first.length; firstIndex++) {
    for (let secondIndex = 1; secondIndex <= second.length; secondIndex++) {
      const cost = first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1;

      rows[firstIndex][secondIndex] = Math.min(
        rows[firstIndex - 1][secondIndex] + 1,
        rows[firstIndex][secondIndex - 1] + 1,
        rows[firstIndex - 1][secondIndex - 1] + cost
      );
    }
  }

  return rows[first.length][second.length];
}

function similarity(first, second) {
  return 1 - editDistance(first, second) / Math.max(first.length, second.length);
}

function findClosestKey(key, keys) {
  let closestKey = null;
  let closestScore = 0;

  for (const candidate of keys) {
    const score = similarity(key, candidate);

    if (score > closestScore) {
      closestKey = candidate;
      closestScore = score;
    }
  }

  return closestScore >= 0.9 ? closestKey : null;
}

let failed = false;

for (const target of TARGETS) {
  if (!fs.existsSync(target.localeDir)) continue;

  const localeFiles = fs.readdirSync(target.localeDir)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(target.localeDir, file));

  const codeFiles = target.codeRoots.flatMap(root => walk(
    path.join(target.codeDir, root),
    target.extensions
  ));

  const localeKeys = new Map();
  const duplicateKeys = [];

  for (const localeFile of localeFiles) {
    const fileName = path.basename(localeFile);

    localeKeys.set(fileName, readLocaleKeys(localeFile));

    for (const key of findDuplicateKeys(localeFile)) {
      duplicateKeys.push(`${fileName}: ${key}`);
    }
  }

  const { dynamicPrefixes, dynamicSuffixes, getLocalizedKeys, unresolved, used } = collectUsedKeys(codeFiles);
  const allKeys = new Set([...localeKeys.values()].flatMap(keys => [...keys]));
  const unusedKeys = [...allKeys].filter(key => !isUsed(key, used, dynamicPrefixes, dynamicSuffixes)).sort();
  const missingUsedKeys = [...used]
    .filter(key => !allKeys.has(key))
    .map(key => ({ key, suggestion: findClosestKey(key, allKeys) }))
    .filter(({ key, suggestion }) => !getLocalizedKeys.has(key) || suggestion)
    .sort((first, second) => first.key.localeCompare(second.key));
  const baseKeys = localeKeys.get('en.json') || localeKeys.values().next().value || new Set();
  const missingKeys = [];

  for (const [fileName, keys] of localeKeys) {
    if (fileName === 'en.json') continue;

    for (const key of baseKeys) {
      if (!keys.has(key)) missingKeys.push(`${fileName}: ${key}`);
    }
  }

  console.log(`\n${target.name}: ${localeFiles.length} locale file(s), ${codeFiles.length} code file(s), ${allKeys.size} key(s)`);

  if (duplicateKeys.length > 0) {
    failed = true;
    console.error(`  Duplicate locale keys (${duplicateKeys.length}):`);

    for (const key of duplicateKeys) console.error(`  - ${key}`);
  } else {
    console.log('  No duplicate locale keys.');
  }

  if (unusedKeys.length > 0) {
    failed = true;
    console.error(`  Unused locale keys (${unusedKeys.length}):`);

    for (const key of unusedKeys) console.error(`  - ${key}`);
  } else {
    console.log('  No unused locale keys.');
  }

  if (missingUsedKeys.length > 0) {
    failed = true;
    console.error(`  Missing locale keys used in code (${missingUsedKeys.length}):`);

    for (const { key, suggestion } of missingUsedKeys) {
      console.error(`  - ${key}${suggestion ? ` (did you mean "${suggestion}"?)` : ''}`);
    }
  } else {
    console.log('  No missing locale keys used in code.');
  }

  if (missingKeys.length > 0) {
    failed = true;
    console.error(`  Missing translations (${missingKeys.length}):`);

    for (const key of missingKeys) console.error(`  - ${key}`);
  } else {
    console.log('  No missing translations.');
  }

  if (unresolved.length > 0) {
    failed = true;
    console.error(`  Unresolved dynamic translation calls (${unresolved.length}):`);

    for (const entry of unresolved) console.error(`  - ${entry}`);
  }
}

if (failed) {
  console.error('\nLocale check failed.');
  process.exit(1);
}

console.log('\nLocale check passed.');
