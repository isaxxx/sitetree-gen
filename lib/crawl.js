/**
 *
 * crawl site
 * @param {object} param      commnad line param
 * @param {function} callback   callback function
 *
 */

'use strict';

const client = require('cheerio-httpcli');
const chalk = require('chalk');
const sleep = require('./util/sleep');
const isAssetFile = require('./util/isAssetFile');
const URL = require('url').URL;

module.exports = (param, callback) => {

  if (!param.url) {
    console.error(chalk.red('Error: url argument is not found'));
    return;
  }

  const host = param.url.slice(-1) !== '/' ? param.url + '/' : param.url;
  const hostStrLength = host.length;
  let hostObj = new URL(host);
  const hostPath = hostObj.pathname;
  const hostPathStrLength = hostPath.length;
  let siteInfo = {};
  let sitetree = {};


  function __crawl (__callback) {

    const urlList = Object.keys(siteInfo);
    const urlListLength = urlList.length;
    let currentUrl = '';
    if ( urlListLength === 0 ) {
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
          console.log(chalk.red('Error: ' + currentUrl));
          siteInfo[currentUrl] = {
            '__title': $('title').text(),
            '__isFetch': true,
            '__hasError': true
          };
          if (currentUrl !== host) {
            sleep(param.speed).then(() => {
              __crawl(__callback);
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
// delete url param and hash
href = href.replace(/\?.*$/, '');
href = href.replace(/\#.*$/, '');
const hrefFirstStr = href.slice(0, 1);
if (!href) {
// nothing
return;
}
if (hrefFirstStr === '.' || hrefFirstStr === '/') {
// convert absolute path
href = new URL(href, currentUrl).toString();
}
if (href.slice(0, hostStrLength) !== host) {
// out of host
return;
}
if (isAssetFile(href)) {
// it is an asset file
return;
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
          __crawl(__callback);
        });
      });
    } else {
// complete
console.log(chalk.green('Complete host: ' + host));
__callback();
}

};


__crawl(() => {

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

  callback(sitetree);

});


};
