/**
 *
 * sanitizeURL
 * @param {string} url
 *
 */

const URL = require('url').URL;

module.exports = (url, baseURL) => {
  if (!url || url.slice(0, 7) === 'mailto:' || url.slice(0, 4) === 'tel:' || url.slice(0, 11) === 'javascript:') {
    return false;
  }
  url = url.replace(/\?.*$/, '');
  url = url.replace(/#.*$/, '');
  if (!url) {
    return false;
  }
  // relative path
  if (url.slice(0, 1) === '.' || url.slice(0, 1) === '/') {
    url = new URL(url, baseURL).toString();
  }
  return url;
};
