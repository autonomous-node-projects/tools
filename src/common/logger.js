/* eslint-disable no-console */
require('colors');

const createData = (data) => {
  let parsedData = data;
  if (typeof (parsedData) === 'object') {
    try {
      parsedData = `[Log: This is stringified Object]: \n ${JSON.stringify(data, null, 2)}`;
    } catch (error) {
      parsedData = data;
    }
  }
  return `[${new Date().toLocaleTimeString()}]: ${parsedData}`;
};

function Log(data) {
  console.log(createData(data).white);
}

Log.success = (data) => {
  console.log(createData(data).green);
};

Log.warn = (data) => {
  console.log(createData(data).yellow);
};

Log.error = (data) => {
  console.log(createData(data).red);
};

module.exports = Log;
