/**
 *
 * Crawl
 * @param {object} param
 * @return {promise}
 *
 */

const chalk = require('chalk');
const isAssetFile = require('./isAssetFile');
const sanitizeURL = require('./sanitizeURL');
const URL = require('url').URL;
const sleep = require('./sleep');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');

module.exports = async(param) => {
  if (param.screenshots) {
    fs.mkdirs('./screenshots');
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('response', (response) => {
    if (300 > response.status() && 200 <= response.status()) {
      return;
    }
    console.log(chalk.red('Status Error: ' + response.status() + ' ' + response.url()));
  });
  page.on('pageerror', (error) => {
    console.log(chalk.red('Console Error: ' + error.message));
  });
  const host = param.url.slice(-1) !== '/' ? param.url + '/' : param.url;
  const hostStrLength = host.length;
  const hostObj = new URL(host);
  const hostPath = hostObj.pathname;
  const hostPathStrLength = hostPath.length;
  const siteInfo = {};
  const sitetree = {};
  const _crawl = async(callback) => {
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
      console.log(chalk.green('Fetching: ' + currentUrl));
      try {
        const response = await page.goto(currentUrl, {
          waitUntil: 'domcontentloaded'
        });
        console.log(response.status());
        if (response.ok()) {
          siteInfo[currentUrl] = {
            '__title': await page.title(),
            '__isFetch': true,
            '__hasError': false
          };
        } else {
          console.log(chalk.red('Error: ' + response.status()));
          siteInfo[currentUrl] = {
            '__title': '',
            '__isFetch': true,
            '__hasError': true
          };
        }
      } catch (err) {
        console.log(chalk.red('Error: ' + currentUrl));
        console.log(chalk.red(err.message));
        siteInfo[currentUrl] = {
          '__title': '',
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

      const items = await page.$$eval('a', (list) => {
        var datas = [];
        for (let i = 0; i < list.length; i++) {
          var data = list[i].href;
          datas.push(data);
        }
        return datas;
      });

      await items.forEach((href) => {
        // console.log(href);
        //let hrefFirstStr;
        href = sanitizeURL(href, currentUrl);
        if (!href) {
          return;
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

      if (param.screenshots) {
        const screenshotsFileName = currentUrl.replace(host, '').replace(/\.html/, '').replace(/\.php/, '').replace(/\//gi, '-').replace(/-$/, '');
        const screenshotsFilePath = './screenshots/' + ((screenshotsFileName === '') ? 'index' : screenshotsFileName) + '.png';
        await page.setViewport({
          width: param.width,
          height: 1000
        });
        await page.screenshot({
          path: screenshotsFilePath,
          fullPage: true
        });
      }

      console.log(chalk.green('Fetched: ' + currentUrl + '\n'));
      // await sleep(param.speed).then(async () => {
      //   await _crawl(callback);
      // });
      await _crawl(callback);
    } else {
      await browser.close();
      console.log(chalk.green('Complete host: ' + host));
      await callback();
    }
  };

  await _crawl(() => {
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
  });

  return sitetree;
};
