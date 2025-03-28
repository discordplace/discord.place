const { inspect } = require('node:util');
const crypto = require('node:crypto');

// eslint-disable-next-line no-async-promise-executor
module.exports = async code => new Promise(async resolve => {
  const isAsync = code.includes('return') || code.includes('await');
  const id = crypto.randomBytes(16).toString('hex');

  try {
    // eslint-disable-next-line security/detect-eval-with-expression
    const result = await eval(isAsync ? `(async () => { ${code} })()` : code);
    const inspectedResult = inspect(result, { depth: Infinity });

    const truncatedResult = inspectedResult.length > 1925 ? `${inspectedResult.slice(0, 1925)}\`\`\`\`\`\`Output is too long. Truncated to 1925 characters.\`` : inspectedResult;

    resolve({ id, result: `\`\`\`js\n${truncatedResult}\`\`\`` });
  } catch (error) {
    const errorMessage = inspect(error, { depth: Infinity });
    logger.error('Error while evaluating code:', error);

    resolve({ id, error: errorMessage });
  }
});