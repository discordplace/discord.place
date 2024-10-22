const crypto = require('node:crypto');
const { inspect } = require('node:util');

// eslint-disable-next-line no-async-promise-executor
module.exports = async code => new Promise(async resolve => {
  const isAsync = code.includes('return') || code.includes('await');
  let result;
  let hasError = false;

  try {
    // eslint-disable-next-line security/detect-eval-with-expression
    result = await eval(isAsync ? `(async () => { ${code} })()` : code);
    if (typeof result !== 'string') result = inspect(result, { depth: 4 });
  } catch (error) {
    hasError = true;
    result = error.stack;
  }

  return resolve({ hasError, id: crypto.randomBytes(16).toString('hex'), result });
});