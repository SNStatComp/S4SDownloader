# S4SDownloader

## Introduction
S4S stands for "Searching for Statistics" by which we mean the activity of searching for
information / data from the internet for improving official statistics.

S4SDownloader is a nodejs package to conveniently download content from the internet specified by a list of urls.

## Installation
Copy the file 'downloader-1.0.0.tgz' into your project directory and run:

`npm install downloader-1.0.0.tgz`


## Documentation
The api of this package can be found [here](api.md)


## Examples

##### example 1: downloader.fromURL

```javascript
var Downloader = require('downloader');

var downloader = new Downloader();

downloader.fromURL('http://example.com/resources/test.pdf', 'outputDir/myFile')
.then(function (res) {
    console.log(res);
})
.catch(function (err) {
    console.log(err);
});
```

##### example 2: downloader.fromCSV

```javascript
var Downloader = require('downloader');

var downloader = new Downloader();

downloader.fromCSV(
    'myFile.csv',
    'outputDir',
    {
        jaar: 2016,
        urlColumn: 'urlPdf',
        fileNameColumns: ['score', 'name']
    });

downloader.on('success', function(res) {
    console.log(res);
});

downloader.on('error', function(err) {
    console.log(err);
});
```
