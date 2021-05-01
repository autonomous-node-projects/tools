const fs = require('fs');
const path = require('path');
const Log = require('./logger');

//
// Read data
//
const readFile = (dataPath, filenameWithExt) => {
  const dataFile = dataPath + filenameWithExt;
  return new Promise((resolve, reject) => {
    try {
      const data = fs.readFileSync(dataFile).toString();
      // Try to parse to JSON
      try {
        const parsedJSON = JSON.parse(data);
        resolve(parsedJSON);
      } catch (errorParsing) {
        // It's not JSON - return plain data from file
        resolve(data);
      }
    } catch (errorReading) {
      // Couldn't read file
      reject(errorReading);
    }
  });
};

//
// Save data
//
const saveToFile = (dataPath, pureData, filenameWithExt) => new Promise((resolve, reject) => {
  const dataFile = dataPath + filenameWithExt;
  const pathToDataFile = dataFile.substring(0, dataFile.lastIndexOf('/'));
  try {
    fs.mkdirSync(pathToDataFile, { recursive: true });
    fs.writeFileSync(dataFile, pureData);
    resolve(true);
  } catch (error) {
    reject(error);
  }
});

class dataManager {
  constructor(datafolder, debug) {
  // All data have to be stored in ${this.dataMainFolder} directory
    this.dataMainFolder = path.normalize(path.join(process.cwd(), `/${datafolder}`));
    this.debug = debug;
  }
}

/**
     * Store data
     * @param {any} Data which will be saved.
     * @param {String} filenameWithExt path to file which will be saved under 'data' directory.
     * @returns {Boolean} An response if data has been saved correctly (True) or not (False).
  */
dataManager.prototype.storeData = async function (data, filenameWithExt) {
  let dataToBeSaved = data;
  if (typeof (data) === 'object') {
    dataToBeSaved = JSON.stringify(data, null, 2);
  }

  try {
    const result = await saveToFile(this.dataMainFolder, dataToBeSaved, filenameWithExt);
    if (this.debug) {
      Log.success(`Saved data to ${this.dataMainFolder}${filenameWithExt}`);
    }
    return result;
  } catch (error) {
    if (this.debug) {
      Log.error(`Cant save data to ${this.dataMainFolder}${filenameWithExt}`);
    }
    return false;
  }
};

/**
     * Read data
     * @param {String} filenameWithExt path to file which will be read under 'data' directory.
     * @returns {Any} An data from file or Boolean = False if data couldn't be read.
  */
dataManager.prototype.readData = async function (filenameWithExt) {
  try {
    const result = await readFile(this.dataMainFolder, filenameWithExt);
    return result;
  } catch (error) {
    if (this.debug) {
      Log.error(`Cant read data from ${this.dataMainFolder}${filenameWithExt}`);
    }
    return {
      type: 'no data',
      message: "couldn't read data from file ",
    };
  }
};

module.exports = dataManager;
