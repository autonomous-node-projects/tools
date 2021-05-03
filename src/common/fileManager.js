/* eslint-disable func-names */
const fs = require('fs');
const path = require('path');
const Log = require('./logger');

const readFile = (dataPath, exactPathFileWithExt) => {
  const dataFile = dataPath + exactPathFileWithExt;
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

const saveToFile = (dataPath, pureData, exactPathFileWithExt) => new Promise((resolve, reject) => {
  const dataFile = dataPath + exactPathFileWithExt;
  const pathToDataFile = dataFile.substring(0, dataFile.lastIndexOf('/'));
  try {
    fs.mkdirSync(pathToDataFile, { recursive: true });
    fs.writeFileSync(dataFile, pureData);
    resolve(true);
  } catch (error) {
    reject(error);
  }
});

/**
     * dataManager
     * @param {any} dataDirectory relative path to data .
     * @param {String} debug set true if debug information is needed.
     * @returns {Object} An object providing read and store data functions.
  */
class dataManager {
  constructor(dataDirectory, debug) {
  // All data have to be stored in ${this.dataMainFolder} directory
    this.dataMainFolder = path.normalize(path.join(process.cwd(), `/${dataDirectory}`));
    this.debug = debug;
  }
}

/**
     * Store data
     * @param {any} Data which will be saved.
     * @param {String} exactPathFileWithExt path to file which will be saved under 'data' directory.
     * @returns {Boolean} An response if data has been saved correctly (True) or not (False).
  */
dataManager.prototype.storeData = async function (data, exactPathFileWithExt) {
  Log(this);
  let dataToBeSaved = data;
  if (typeof (data) === 'object') {
    dataToBeSaved = JSON.stringify(data, null, 2);
  }

  try {
    const result = await saveToFile(this.dataMainFolder, dataToBeSaved, exactPathFileWithExt);
    if (this.debug) {
      Log.success(`Saved data to ${this.dataMainFolder}${exactPathFileWithExt}`);
    }
    return result;
  } catch (error) {
    if (this.debug) {
      Log.error(`Cant save data to ${this.dataMainFolder}${exactPathFileWithExt}`);
    }
    return {
      error: 'Save error',
      message: "couldn't read data from file ",
    };
  }
};

/**
     * Read data
     * @param {String} exactPathFileWithExt path to file which will be read under 'data' directory.
     * @returns {Any} An data from file or Boolean = False if data couldn't be read.
  */
dataManager.prototype.readData = async function (exactPathFileWithExt) {
  try {
    const result = await readFile(this.dataMainFolder, exactPathFileWithExt);
    return result;
  } catch (error) {
    if (this.debug) {
      Log.error(`Cant read data from ${this.dataMainFolder}${exactPathFileWithExt}`);
    }
    return {
      error: 'Read error',
      message: "couldn't read data from file",
    };
  }
};

module.exports = dataManager;
