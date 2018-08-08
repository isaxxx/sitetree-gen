/**
 *
 * Sleep
 * @param {number} time
 * @return {promise}
 *
 */

module.exports = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
