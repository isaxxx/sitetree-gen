/**
 *
 * exec
 * @param {object} param
 * @param {function} callback
 *
 */

'use strict';

const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const fs = require('fs-extra');
const pkg = require('../package.json');
const defaultParam = require('./command');
const crawl = require('./util/crawl');

module.exports = (param, callback) => {
  param = Object.assign({}, defaultParam, param);
  callback = callback || function () {};
  return new Promise((resolve, reject) => {
    updateNotifier({pkg}).notify();
    resolve();
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      crawl(param, (err, object) => {
        if (err) {
          reject(err, object);
        } else {
          try {
            const str = JSON.stringify(object, undefined , 2);
            resolve({
              str: str,
              object: object
            });
          } catch (err) {
            reject(err, object);
          }
        }
      });
    });
  })
  .then((sitetree) => {
    return new Promise((resolve, reject) => {
      if (param.output) {
        fs.outputFile(param.output, sitetree.str, (err) => {
          if (err) {
            reject(err, sitetree.object);
          } else {
            if (param.log) {
              console.log(chalk.green('Output: ' + param.output));
            }
            callback(false, sitetree.object);
            resolve();
          }
        });
      } else {
        callback(false, sitetree.object);
        resolve();
      }
    });
  })
  .catch((err, object) => {
    if (param.log) {
      console.error(chalk.red(err));
    }
    callback(err, object);
  });
};
