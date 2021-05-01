const dataManager = require('../common/fileManager');
const Log = require('../common/logger');

const manager = new dataManager('data/');

const save = async () => {
  // Try to save json data
  const object = { testKey: 'testValue' };
  await manager.storeData(object, 'test_dir/JSONFILE.json');

  // Try to load string data
  const string = 'Test string';
  await manager.storeData(string, 'test_dir/TEXTFILE.txt');
};

const read = async () => {
  // Try to read json data
  const json = await manager.readData('test_dir/JSONFILE.json');
  Log.success(JSON.stringify(json, null, 2));

  // Try to load string data
  const txt = await manager.readData('test_dir/TEXTFILE.txt');
  Log.success(txt);
};

save();
read();
