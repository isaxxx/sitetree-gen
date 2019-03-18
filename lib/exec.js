/**
 *
 * Exec
 * @param {object} param
 * @return {promise}
 *
 */

const chalk = require('chalk');
const fs = require('fs-extra');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const defaultParam = require('./command');
const crawl = require('./util/crawl');

module.exports = (param) => {
  return new Promise((resolve) => {
    updateNotifier({pkg}).notify();
    param = Object.assign(defaultParam, param);
    resolve();
  }).then(async() => {
    const sitetreeObject = await crawl(param);
    console.log(sitetreeObject);
    return new Promise((resolve, reject) => {
      try {
        const sitetreeStr = JSON.stringify(sitetreeObject, undefined, 2);
        resolve({
          str: sitetreeStr,
          object: sitetreeObject
        });
      } catch (err) {
        reject(err);
      }
    });
  }).then((sitetree) => {
    return new Promise((resolve, reject) => {
      fs.outputFile(param.output, sitetree.str, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(chalk.green('Output: ' + param.output));
          resolve(sitetree.object);
        }
      });
    });
  }).catch((err) => {
    console.error(chalk.red(err));
  });
};
