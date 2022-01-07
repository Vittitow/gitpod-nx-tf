require('ts-node').register({
  project: 'tsconfig.base.json',
});

module.exports = require('./terraform-plan.impl.ts');
