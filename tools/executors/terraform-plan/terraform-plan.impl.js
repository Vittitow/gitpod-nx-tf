require('ts-node').register({
  project: './tools/tsconfig.tools.json',
});

module.exports = require('./terraform-plan.impl.ts');
