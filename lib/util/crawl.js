/**
 *
 * Crawl
 * @param {object} param
 * @return {promise}
 *
 */

const chalk = require('chalk');
const client = require('cheerio-httpcli');
const isAssetFile = require('./isAssetFile');
const URL = require('url').URL;
const sleep = require('./sleep');

module.exports = (param) => {
  return new Promise((resolve, reject) => {
    if (!param.url) {
      reject('Error: url argument is not found');
    } else if (parseInt(param.speed) < 3000) {
      reject('Error: speed must be set above 3000');
    } else {
      resolve();
    }
  }).then(() => {
    return new Promise((resolve) => {
      const host = param.url.slice(-1) !== '/' ? param.url + '/' : param.url;
      const hostStrLength = host.length;
      const hostObj = new URL(host);
      const hostPath = hostObj.pathname;
      const hostPathStrLength = hostPath.length;
      const siteInfo = {};
      const sitetree = {};
      const _crawl = (callback) => {
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
          client.fetch(currentUrl, (err, $) => {
            if (err) {
              console.log(chalk.red('Error: ' + currentUrl));
              siteInfo[currentUrl] = {
                '__title': $('title').text(),
                '__isFetch': true,
                '__hasError': true
              };
              if (currentUrl !== host) {
                sleep(param.speed).then(() => {
                  _crawl(callback);
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
              let hrefFirstStr;
              if (!href) {
                return;
              }
              if (href.slice(0, 7) === 'mailto:' || href.slice(0, 4) === 'tel:' || href.slice(0, 11) === 'javascript:') {
                return;
              }
              href = href.replace(/\?.*$/, '');
              href = href.replace(/#.*$/, '');
              hrefFirstStr = href.slice(0, 1);
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
            console.log(chalk.green('Fetched: ' + currentUrl));
            sleep(param.speed).then(() => {
              _crawl(callback);
            });
          });
        } else {
          console.log(chalk.green('Complete host: ' + host));
          callback();
        }
      };
      _crawl(() => {
        const urlList = Object.keys(siteInfo);
        const urlListLength = urlList.length;
        for (let i = 0; i < urlListLength; i++) {
          let path;
          let pathList;
          let pathListLength;
          let currentTree;
          if (siteInfo[urlList[i]].__hasError) {
            continue;
          }
          path = new URL(urlList[i]);
          path = path.pathname;
          path = path.slice(hostPathStrLength - 1);
          pathList = path.split('/');
          pathList[0] = '/';
          if (pathList[pathList.length - 1] === '') {
            pathList.pop();
          }
          pathListLength = pathList.length;
          currentTree = sitetree;
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
              let child;
              if (!sitetree.hasOwnProperty('children')) {
                sitetree.children = [];
              }
              if (j > 1) {
                currentTree = currentTree.children.find((item) => {
                  return item.name === pathList[j - 1];
                });
              }
              child = currentTree.children.find((item) => {
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
        resolve(sitetree);
      });
    });
  }).catch((err) => {
    console.error(chalk.red(err));
  });
};
