/**
 *
 * Command
 * @return {object}
 *
 */

module.exports = require('yargs').usage('sitetree [options]').option('url', {
  type: 'string',
  describe: 'target site url.'
}).option('output', {
  default: './sitetree.json',
  type: 'string',
  describe: 'output json file path.'
}).option('speed', {
  default: 3000,
  type: 'number',
  describe: 'crawl speed.'
}).version().help('help').alias('version', 'v').alias('help', 'h').argv;
