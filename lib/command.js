/**
 *
 * command
 * @return {object} config
 *
 */

'use strict';

module.exports = require('yargs').usage('sitetree [options]')
.option('url', {
  type: 'string',
  describe: 'target site url.'
})
.option('output', {
  type: 'string',
  describe: 'output json file path.'
})
.option('speed', {
  default: 3000,
  type: 'number',
  describe: 'crawl speed.',
})
.option('log', {
  default: true,
  type: 'bool',
  describe: 'whether to log.',
})
.version()
.help('help')
.alias('version', 'v')
.alias('help', 'h')
.argv;
