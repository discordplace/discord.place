const { inspect } = require('node:util');
const crypto = require('node:crypto');

// eslint-disable-next-line no-async-promise-executor
module.exports = async code => new Promise(async resolve => {
  const isAsync = code.includes('return') || code.includes('await');
  let result;
  let hasError = false;

  try {
    result = await eval(isAsync ? `(async () => { ${code} })()` : code);
    if (typeof result !== 'string') result = inspect(result, { depth: 4 });
  } catch (error) {
    hasError = true;
    result = error.stack;
  }

  return resolve({ result, hasError, id: crypto.randomBytes(16).toString('hex') });
});