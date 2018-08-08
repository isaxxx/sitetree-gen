/**
 *
 * isAssetFile
 * @param {string} url
 * @return {bool}
 *
 */

module.exports = (url) => {
  const extension = [
    'gif',
    'jpg',
    'jpeg',
    'png',
    'ico',
    'bmp',
    'ogg',
    'webp',
    'mp4',
    'webm',
    'mp3',
    'ttf',
    'woff',
    'json',
    'rss',
    'atom',
    'gz',
    'zip',
    'rar',
    '7z',
    'css',
    'js',
    'gzip',
    'exe',
    'svg'
  ].join('|');
  const extensionRegex = new RegExp(`\\.(${extension})$`, 'i');
  return url.match(extensionRegex) ? true : false;
};
