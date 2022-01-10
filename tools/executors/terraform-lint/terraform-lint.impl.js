require('ts-node').register({
  project: './tools/tsconfig.tools.json',
});

module.exports = require('./terraform-lint.impl.ts');
