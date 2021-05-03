const dataManager = require('../common/fileManager');
const Log = require('../common/logger');

const manager = new dataManager('data/');

const save = async () => {
  let result;
  // Try to save json data
  const objectData = { testKey: 'testValue' };
  result = await manager.storeData(objectData, 'test_dir/JSONFILE.json');

  // Try to save string data
  const stringData = 'Test string';
  result = await manager.storeData(stringData, 'test_dir/TEXTFILE.txt');
  Log(result);
};

const read = async () => {
  // Try to read json data
  const json = await manager.readData('test_dir/JSONFILE.json');
  if (!json.error) {
    Log.success(json);
  } else {
    Log.error(json);
  }

  // Try to load string data
  const txt = await manager.readData('test_dir/TEXTFILE.txt');
  if (!txt.error) {
    Log.success(txt);
  } else {
    Log.error(txt);
  }
};

save();
read();
