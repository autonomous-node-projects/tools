const Log = require('../common/logger');

const JsonDataToBeStringified = {
  exampleKeyFirst: 0,
  exampleKeySecond: ['exampleValue', null],
};

const ParsedData = JSON.stringify(JsonDataToBeStringified, null, 2);

Log(JsonDataToBeStringified);
Log(ParsedData);

Log('Default log');
Log.success('Success log');
Log.warn('Warn log');
Log.error('Error log');
