/**
 *
 * sleep
 * @param {number} time     sleep time
 * @return {object}         promise object
 *
 */

module.exports = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};
