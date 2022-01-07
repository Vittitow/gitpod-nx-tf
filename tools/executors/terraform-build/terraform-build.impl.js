require('ts-node').register({
  project: 'tsconfig.base.json',
});

module.exports = require('./terraform-build.impl.ts');
