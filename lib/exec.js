const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const fs = require('fs-extra');
const pkg = require('../package.json');
const defaultParam = require('./command');
const crawl = require('./crawl');

/**
 *
 * exec
 * @param {object} param        param object
 * @param {function} callback   callback
 *
 */

module.exports = (param, callback) => {
    param = Object.assign({}, defaultParam, param);
    callback = callback || function () {};
    return new Promise((resolve, reject) => {
        updateNotifier({pkg}).notify();
        resolve();
    })
    .then(() => {
        crawl(param, (sitetree) => {
            if (param.output) {
                let sitetreeStr = '';
                try {
                    sitetreeStr = JSON.stringify(sitetree, undefined , 2);
                } catch (err) {
                    console.error(chalk.red(err));
                }
                fs.outputFile(param.output, sitetreeStr, (err) => {
                    if (err) {
                        console.error(chalk.red(err));
                    } else {
                        console.log(chalk.green('Output: ' + param.output));
                    }
                });
            }
            callback(sitetree);
        });
    });
};
