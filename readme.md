# Request tools
This is set of often used tools while creating autonomic project:
* Logger 
    * Auto parsed JSON
    * Colors per log type
* HTTP request wrapper 
    * Auto parsed JSON
    * Download binary data
* Files manager
    * read and store data with easy manager

## Logger
Functions:
```
Log(string | object)
Log.success(string | object)
Log.warn(string | object)
Log.error(string | object)
```
*While logging object it will be stringified with additional message: `[Log: This is stringified Object]`*

## HTTP request wrapper

### To download binary data - example :
```
const requestConfig = {
    url: 'https://someurl/file.jpg',
    method: 'GET',
    timeout: 2000,
    headers: {},
    data: {},
    dataDirectory: 'data/',
    debug: false,
}
const result = await SendHTTPrequest(requestConfig);
if(result.status === 200){  
    Log(result.data);
}
```

### To download any text (JSON is auto parsed) - example :
```
const requestConfig = {
    url: 'https://someurl/endpointForJSON',
    method: 'POST',
    timeout: 1500,
    headers: {},
    data: {},
    debug: false,
}
const result = await SendHTTPrequest(requestConfig);
if(result.status === 200){  
    Log(result.data);
}
```
Both examples will return:
* on success: HTTP response object (`data` key is body from response)
* on error: error object - example :
```
{
    error: 'error type',
    message: 'error details',
}
```
## Files manager
At first create dataManager object with path to directory (Realtive to project directory)
```
const manager = new dataManager('data/');
```

### To store data - example :
```
const save = async () => {
    // Try to save json data
    const object = { testKey: 'testValue' };
    // relative directory if not existing will be created
    await manager.storeData(object, 'test_dir/JSONFILE.json');

    // Try to load string data
    const string = 'Test string';
    await manager.storeData(string, 'test_dir/TEXTFILE.txt');
};
```
It will return:
* on success: `True`
* on error: error object

### To read data - example :
```
const read = async () => {
    // Try to read json data
    const json = await manager.readData('test_dir/JSONFILE.json');
    if(!json.error){
      Log.success(json);
    }

    // Try to load string data
    const txt = await manager.readData('test_dir/TEXTFILE.txt');
    if(!txt.error){
      Log.success(txt);
    }
};
```
It will return:
* on success: data from file
* on error: error object - example :
```
{
    error: 'Read error',
    message: 'Couldn't read data from file',
}
```

**ALL EXAMPLES ARE UNDER: `package_name/src/examples/`**