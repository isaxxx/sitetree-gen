# sitetree-gen

Sitetree Generator.

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
  --url           target site url. [string]
  --output        output json file path. [string] [default: './sitetree.json']
  --speed         crawl speed. [number] [default: 3000]
  --version, -v   show this version. [boolean]
  --help, -h      show this help. [boolean]
```

## Example

### CLI

```bash
$ sitetree-gen --url http://example.com --output ./sitetree.json --speed 3000
```

### JavaScript

```js
const sitetreeGen = require('sitetree-gen');

sitetreeGen({
  url: 'http://example.com'
}, (err, sitetree) => {
  if (!err) {
    console.log(sitetree.title);
  }
});
```

### JSON

```json
{
  "name": "/",
  "title": "Front Page",
  "url": "http://example.com/",
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
              "url": "http://example.com/archives/category/dog/"
            },
            {
              "name": "cat",
              "title": "Dog - Category - Archives - Front Page",
              "url": "http://example.com/archives/category/cat/"
            }
          ]
        }
      ]
    },
    {
      "name": "about",
      "title": "About - Front Page",
      "url": "http://example.com/about/",
      "children": [
        {
          "name": "animals",
          "title": "Animals - About - Front Page",
          "url": "http://example.com/about/animals/"
        }
      ]
    }
  ]
}
```

### Sample Infographics

[https://isaxxx.com/no-wp/sitetree-gen/](https://isaxxx.com/no-wp/sitetree-gen/)

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
