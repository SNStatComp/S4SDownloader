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

/**
 *@classdesc Save files downloaded from the web
 *@extends EventEmitter
 */
class Download extends EventEmitter {
     /**
      *Create instance of class Download
      *@constructor
      *@param {none}
      */
    constructor() {
        super()
    }

    /**
     * Download file from url and save to fileName
     * @param  {string}         url      - The url of the file to be downloaded
     * @param  {string}         fileName - The name of the file to save to (without extension).
     * @return {Promise|string}            The name of the saved file
     */
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
                                fileName = fileName + '.' + ext;
                                fs.writeFileSync(fileName, result);
                                resolve(fileName);
                            },
                            function(err) {
                                reject({ url: url, error: err });
                            });
                    })
                    .catch(
                        function(err) {
                            reject({ url: url, error: err });
                        });
            });
    }

    /**
     * Download files mentioned in {@link csvFile} and save them in {@link destDir}
     * @param  {string}         csvFile - Name of the csv file
     * @param  {string}         destDir - Destination directory
     * @param  {Object}         options
     * @param  {string}         options.urlColumn - The column name in csvFile containing the url
     * @param  {Array<string>}  options.filenameColumns - Array of column names in the csvFile to be used as part of the name of the output file
     * @param  {Object}         [options.format={headers: true, delimiter: ";", rowDelimiter: "\r\n", quoteColumns: true}] - Format of the csv file
     * @param  {integer}        options.year - Year, used as part of the name of the output file
     * @param  {integer}        [options.concurrency=1] - Number of concurrent downloads
     * @fires  Download#success
     * @fires  Download#error
     */
    fromCSV(csvFile, destDir, options) {
        /**
         * @event Download#success
         * @type {string} - The url of the downloaded file
         */
        /**
         * @event Download#error
         * @type {string} - Error message
         */
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
                    fileName: destDir + today + '_' + options.year + userSelected
                };
                q.push(data);
            });
    }
}

module.exports = Download;
