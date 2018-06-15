/**
 *
 * crawl
 * @param {object} param
 * @param {function} callback
 *
 */

'use strict';

const client = require('cheerio-httpcli');
const chalk = require('chalk');
const isAssetFile = require('./isAssetFile');
const sleep = require('./sleep');
const URL = require('url').URL;

module.exports = (param, callback) => {
  callback = callback || function () {};
  return new Promise((resolve, reject) => {
    if (!param.url) {
      reject('Error: url argument is not found');
    } else {
      resolve();
    }
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      let siteInfo = {},
        sitetree = {};
      const host = param.url.slice(-1) !== '/' ? param.url + '/' : param.url;
      const hostStrLength = host.length;
      const hostObj = new URL(host);
      const hostPath = hostObj.pathname;
      const hostPathStrLength = hostPath.length;
      const _crawl = (_callback) => {
        const urlList = Object.keys(siteInfo);
        const urlListLength = urlList.length;
        let currentUrl = '';
        if (urlListLength === 0) {
          currentUrl = host;
        } else {
          for (let i = 0; i < urlListLength; i++) {
            if (siteInfo[urlList[i]].__isFetch) {
              continue;
            } else {
              currentUrl = urlList[i];
              break;
            }
          }
        }
        if (currentUrl) {
          client.fetch(currentUrl, (err, $, res, body) => {
            if (err) {
              if (param.log) {
                console.log(chalk.red('Error: ' + currentUrl));
              }
              siteInfo[currentUrl] = {
                '__title': $('title').text(),
                '__isFetch': true,
                '__hasError': true
              };
              if (currentUrl !== host) {
                sleep(param.speed).then(() => {
                  _crawl(_callback);
                });
              }
              return;
            }
            siteInfo[currentUrl] = {
              '__title': $('title').text(),
              '__isFetch': true,
              '__hasError': false
            };
            $('a').each((index, target) => {
              let href = $(target).attr('href');
              href = href.replace(/\?.*$/, '');
              href = href.replace(/\#.*$/, '');
              const hrefFirstStr = href.slice(0, 1);
              if (!href) {
                return;
              }
              if (hrefFirstStr === '.' || hrefFirstStr === '/') {
                href = new URL(href, currentUrl).toString();
              }
              if (isAssetFile(href)) {
                return;
              }
              if (href.slice(0, 4) === 'http' && href.slice(0, hostStrLength) !== host) {
                return;
              } else {
                href = new URL(href, currentUrl).toString();
              }
              if (href && !siteInfo.hasOwnProperty(href)) {
                siteInfo[href] = {
                  '__title': '',
                  '__isFetch': false,
                  '__hasError': false
                };
              }
            });
            if (param.log) {
              console.log(chalk.green('Fetched: ' + currentUrl));
            }
            sleep(param.speed).then(() => {
              _crawl(_callback);
            });
          });
        } else {
          if (param.log) {
            console.log(chalk.green('Complete host: ' + host));
          }
          _callback();
        }
      };
      _crawl(() => {
        const urlList = Object.keys(siteInfo);
        const urlListLength = urlList.length;
        for (let i = 0; i < urlListLength; i++) {
          if (siteInfo[urlList[i]].__hasError) {
            continue;
          }
          let path = new URL(urlList[i]);
          path = path.pathname;
          path = path.slice(hostPathStrLength - 1);
          let pathList = path.split('/');
          pathList[0] = '/';
          if (pathList[pathList.length - 1] === '') {
            pathList.pop();
          }
          const pathListLength = pathList.length;
          let currentTree = sitetree;
          for (let j = 0; j < pathListLength; j++) {
            if (j === 0) {
              if (!sitetree.name) {
                sitetree.name = pathList[j];
                if (pathListLength === 1) {
                  sitetree.title = siteInfo[urlList[i]].__title;
                  sitetree.url = urlList[i];
                }
              }
            } else {
              if (!sitetree.hasOwnProperty('children')) {
                sitetree.children = [];
              }
              if (j > 1) {
                currentTree = currentTree.children.find( (item) => {
                  return item.name === pathList[j-1];
                });
              }
              let child = currentTree.children.find( (item) => {
                return item.name === pathList[j];
              });
              if (!child) {
                child = {
                  name: pathList[j]
                };
                currentTree.children.push(child);
              }
              if (j === pathListLength - 1) {
                child.title = siteInfo[urlList[i]].__title;
                child.url = urlList[i];
              } else {
                if (!child.hasOwnProperty('children')) {
                  child.children = [];
                }
              }
            }
          }
        }
        callback(false, sitetree);
        resolve();
      });
    });
  })
  .catch((err, str) => {
    callback(err, str);
  });
};
