# sitetree-gen

Generate the site tree object and the JSON file for information graphics.

[![NPM](https://nodei.co/npm/sitetree-gen.png)](https://nodei.co/npm/sitetree-gen/)
[![Build Status](https://travis-ci.org/isaxxx/sitetree-gen.svg?branch=master)](https://travis-ci.org/isaxxx/sitetree-gen)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

## Installation

### npm

```bash
$ npm install sitetree-gen --save
```

## Usage

```
Options:
  --url, -u       target site url. [string]
  --output, -o    output json file path. [string]
  --speed, -s     crawl speed. [number] [default: 3000]
  --version, -v   show this version. [boolean]
  --help, -h      show this help. [boolean]
```

## Example

##### CLI

```bash
$ sitetree-gen -u http://example.com -o ./dest/example.json -s 5000
```

##### API

```js
const sitetreeGen = require('sitetree-gen');

sitetreeGen({
  url: 'http://example.com',
  url: 'http://example.com'
}, (sitetree) => {
  console.log(sitetree.title);
});
```

##### JSON

```json
{
  "name": "/",
  "title": "Front Page",
  "url": "https://isaxxx.com/",
  "children": [
    {
      "name": "archives",
      "children": [
        {
          "name": "category",
          "children": [
            {
              "name": "dog",
              "title": "Dog - Category - Archives - Front Page",
              "url": "https://isaxxx.com/archives/category/dog/"
            },
            {
              "name": "cat",
              "title": "Dog - Category - Archives - Front Page",
              "url": "https://isaxxx.com/archives/category/cat/"
            }
          ]
        }
      ]
    },
    {
      "name": "about",
      "title": "About - Front Page",
      "url": "https://isaxxx.com/about/",
      "children": [
        {
          "name": "inquiry",
          "title": "Inquiry - About - Front Page",
          "url": "https://isaxxx.com/about/inquiry/"
        }
      ]
    }
  ]
}
```

For more in depth documentation see: https://isaxxx.com/works/sitetree-gen/

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
