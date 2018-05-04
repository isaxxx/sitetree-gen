/**
 *
 * command line
 * @return {object} config object
 *
 */

module.exports = require('yargs').usage('sitetree [options]')
.option('url', {
    alias: 'u',
    type: 'string',
    describe: 'target site url.'
})
.option('output', {
    alias: 'o',
    type: 'string',
    describe: 'output json file path.'
})
.option('speed', {
	default: 3000,
    alias: 's',
    type: 'number',
    describe: 'crawl speed.',
})
.version()
.help('help')
.alias('version', 'v')
.alias('help', 'h')
.argv;
