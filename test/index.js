const test = require('ava');
const sitetreeGen = require('../index');

test('exec - case 001', (t) => {
  return sitetreeGen({
    url: 'http://example.com',
    output: './sitetree.json',
    speed: 5000
  }).then((sitetree) => {
    return new Promise((resolve, reject) => {
      if (sitetree.title === 'Example Domain') {
        resolve(t.pass());
      } else {
        reject(t.fail());
      }
    });
  });
});
