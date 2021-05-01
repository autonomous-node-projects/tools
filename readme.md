# Request tools
This is set of often used tools while creating autonomic project:
* Logger
* HTTP request wrapper
* Files manager

## Tools:
### Logger
Functions:
```
Log('string')
Log.success('string')
Log.warn('string')
Log.error('string')
```
### HTTP request wrapper
Can download binary data - example:
```
  const requestConfig = {
    url: 'https://someurl/file.jpg',
    method: 'GET',
    timeout: 1000,
    headers: {},
    data: {},
    dataDirectory: 'data/',
    debug: true,
}
const result = await SendHTTPrequest(requestConfig);
Log(result.data);
```

Can download any text (JSON is auto parsing) - example:
```
  const requestConfig = {
    url: 'https://someurl/endpointForJSON',
    method: 'POST',
    timeout: 1000,
    headers: {},
    data: {},
    debug: true,
}
const result = await SendHTTPrequest(requestConfig);
Log(JSON.stringify(result.data, null, 2));
```

### Files manager
At first create dataManager object
```
const manager = new dataManager('data/');
```

* to store data
```
const save = async () => {
  // Try to save json data
  const object = { testKey: 'testValue' };
  await manager.storeData(object, 'test_dir/JSONFILE.json');

  // Try to load string data
  const string = 'Test string';
  await manager.storeData(string, 'test_dir/TEXTFILE.txt');
};
```

* to read data
```
const read = async () => {
  // Try to read json data
  const json = await manager.readData('test_dir/JSONFILE.json');
  Log.success(JSON.stringify(json, null, 2));

  // Try to load string data
  const txt = await manager.readData('test_dir/TEXTFILE.txt');
  Log.success(txt);
};
```

**ALL EXAMPLES ARE UNDER: `src/examples/`**