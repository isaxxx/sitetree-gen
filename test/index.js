const sitetreeGen = require('../index');
const test = require('ava');

// test

test('crawl test', (t) => {
	return new Promise((resolve, reject) => {
		return sitetreeGen({
			url: 'http://example.com'
		}, (sitetree) => {
			if (sitetree.title === 'Example Domain') {
	        	return resolve(t.pass());
	        } else {
				return reject(t.fail());
	        }
		});
	});
});
