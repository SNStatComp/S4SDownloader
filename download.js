/*jslint node: true */
'use strict';
var moment = require('moment');
var fs = require('fs');
var csv = require('fast-csv');
var async = require('async');
var down = require('download');
var sanitize = require('sanitize-filename');
var mime = require('mime');
var EventEmitter = require('events');

class Download extends EventEmitter {

    constructor() {
        super()
    }

    fromURL(url, fileName) {
        return new Promise(
            function(resolve, reject) {
                var header;
                down(url)
                    .on('response', function(response) {
                        header = Promise.resolve(response.headers)
                    })
                    .then(function(data) {
                        var result = data;
                        Promise.all([header]).then(
                            function(value, reason) {
                                var ext = mime.extension(value[0]['content-type']);
                                fs.writeFileSync(fileName + '.' + ext, result);
                                resolve(url);
                            },
                            function(err) {
                                reject({
                                    url: url,
                                    error: err
                                });
                            });
                    })
                    .catch(
                        function(err) {
                            reject({
                                url: url,
                                error: err
                            });
                        });
            });
    }

    fromCSV(csvFile, destDir, options) {
        var self = this;
        var EXCEL_CSV_NL = {
            headers: true,
            delimiter: ";",
            rowDelimiter: "\r\n",
            quoteColumns: true
        };
        var today = moment().format('YYYYMMDD');
        var readableStream = fs.createReadStream(csvFile);
        var concurrency = options.concurrency || 1;
        var q = async.queue(function(task, callback) {
            self.fromURL(task.url, task.fileName).then(
                function(url) {
                    self.emit('success', url);
                },
                function(err) {
                    self.emit('error', err.url + ': ' + err.error)
                }
            );
            callback();
        }, concurrency);
        var format = options.format || EXCEL_CSV_NL;

        csv.fromStream(readableStream, format)
            .on('data', function(record) {
                var userSelected = sanitize(
                    options.fileNameColumns.reduce(
                        function(a, b) {
                            return a + '_' + record[b];
                        }, '')
                )
                var data = {
                    url: record[options.urlColumn],
                    fileName: destDir + today + '_' + options.jaar + userSelected
                };
                q.push(data);
            });
    }
}

module.exports = Download;
