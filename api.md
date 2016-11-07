<a name="Download"></a>

## Download ⇐ <code>EventEmitter</code>
Save files downloaded from the web

**Kind**: global class  
**Extends:** <code>EventEmitter</code>  

* [Download](#Download) ⇐ <code>EventEmitter</code>
    * [new Download()](#new_Download_new)
    * [.fromURL(url, fileName)](#Download+fromURL) ⇒ <code>Promise</code> &#124; <code>string</code>
    * [.fromCSV(csvFile, destDir, options)](#Download+fromCSV)
    * ["success"](#Download+event_success)
    * ["error"](#Download+event_error)

<a name="new_Download_new"></a>

### new Download()
Create instance of class Download

**Params**

-  <code>none</code>

<a name="Download+fromURL"></a>

### download.fromURL(url, fileName) ⇒ <code>Promise</code> &#124; <code>string</code>
Download file from url and save to fileName

**Kind**: instance method of <code>[Download](#Download)</code>  
**Returns**: <code>Promise</code> &#124; <code>string</code> - The name of the saved file  
**Params**

- url <code>string</code> - The url of the file to be downloaded
- fileName <code>string</code> - The name of the file to save to (without extension).

<a name="Download+fromCSV"></a>

### download.fromCSV(csvFile, destDir, options)
Download files mentioned in [csvFile](csvFile) and save them in [destDir](destDir)

**Kind**: instance method of <code>[Download](#Download)</code>  
**Emits**: <code>[success](#Download+event_success)</code>, <code>[error](#Download+event_error)</code>  
**Params**

- csvFile <code>string</code> - Name of the csv file
- destDir <code>string</code> - Destination directory
- options <code>Object</code>
    - .urlColumn <code>string</code> - The column name in csvFile containing the url
    - .filenameColumns <code>Array.&lt;string&gt;</code> - Array of column names in the csvFile to be used as part of the name of the output file
    - [.format] <code>Object</code> <code> = {headers: true, delimiter: &quot;;&quot;, rowDelimiter: &quot;\r\n&quot;, quoteColumns: true}</code> - Format of the csv file
    - .year <code>integer</code> - Year, used as part of the name of the output file
    - [.concurrency] <code>integer</code> <code> = 1</code> - Number of concurrent downloads

<a name="Download+event_success"></a>

### "success"
**Kind**: event emitted by <code>[Download](#Download)</code>  
**Properties**

| Type | Description |
| --- | --- |
| <code>string</code> | The url of the downloaded file |

<a name="Download+event_error"></a>

### "error"
**Kind**: event emitted by <code>[Download](#Download)</code>  
**Properties**

| Type | Description |
| --- | --- |
| <code>string</code> | error message |

