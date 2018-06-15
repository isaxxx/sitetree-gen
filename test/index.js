/**
 *
 * index
 *
 */

'use strict';

const sitetreeGen = require('../index');
const test = require('ava');

test('crawl', (t) => {
	return new Promise((resolve, reject) => {
		return sitetreeGen({
			url: 'http://example.com'
		}, (err, sitetree) => {
			if (!err && sitetree.title === 'Example Domain') {
				return resolve(t.pass());
			} else {
				return reject(t.fail());
			}
		});
	});
});
