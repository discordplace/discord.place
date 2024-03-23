const { execSync } = require('child_process');

const changedFiles = execSync('git diff --name-only HEAD HEAD~1').toString().split('\n');
const isClientChanged = changedFiles.some(file => file.startsWith('client/'));

if (!isClientChanged) throw new Error('No changes detected in client/ directory. Cancelling build...');

console.log('Changes detected in client/ directory. Proceeding with the build...');