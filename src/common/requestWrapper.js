const fs = require('fs');
const fetch = require('node-fetch');
const AbortController = require('node-abort-controller');
const Log = require('./logger');

const binaryContentTypesToBeSaved = [
  'image/png', 'image/jpeg', 'image/jpg',
];

const saveBinary = (response, dataDirectory) => new Promise((resolve, reject) => {
  fs.mkdirSync(`${dataDirectory}tmp`, { recursive: true });
  const dest = fs.createWriteStream(`${dataDirectory}tmp/binaryFile`);
  try {
    response.body.pipe(dest);
    resolve(`${dataDirectory}tmp/binaryFile`);
  } catch (error) {
    reject(error);
  }
});

const parseData = async (response, headers, dataDirectory, debug) => {
  if (debug) {
    Log.warn('Trying to parse data');
  }
  const contentType = headers['content-type'];
  if (contentType.includes('json')) {
    const rawData = await response.json();
    return (rawData);
  } if (binaryContentTypesToBeSaved.find((currType) => contentType.includes(currType))) {
    return saveBinary(response, dataDirectory);
  }
  return response.text();
};

const fetchMethod = async (endpoint, initialFetchConfig, timeout = 5000, dataDirectory = '', debug = false) => {
  const controller = new AbortController();
  const { signal } = controller;
  const fetchConfig = { ...initialFetchConfig, signal };

  const abortTimeout = setTimeout(() => {
    controller.abort();
  }, timeout);

  const response = await fetch(endpoint, fetchConfig);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  const responseObject = {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    data: await parseData(response, Object.fromEntries(
      response.headers.entries(),
    ), dataDirectory, debug),
  };
  clearTimeout(abortTimeout);
  return responseObject;
};

/**
     * Send an HTTP Request
     * @param {Object} requestConfig - Request configuration which will be send.
     * @param {string} requestConfig.url to make http request.
     * @param {string} requestConfig.method Http request method.
     * @param {object} requestConfig.headers Http request headers.
     * @param {object} requestConfig.data Http request data.
     * @param {number} requestConfig.timeout Http request timeout in miliseconds.
     * @param {string} requestConfig.dataDirectory If request will return binary file set where
     * file should be saved.
     * @param {number} requestConfig.debug Turns on debug mode - set to 'True'.
     * @returns {Object} An {status, statusText, headers, data}
     * containing status and data from response.
  */
const SendHTTPrequest = async ({
  url,
  method,
  // Predefined data
  headers,
  data,
  timeout,
  dataDirectory,
  debug,
}) => {
  // Headers settings
  let allHeaders = {};
  if (headers) {
    allHeaders = headers;
  } else {
    allHeaders['Content-Type'] = 'application/json';
  }

  // Fetch settings
  const fetchConfig = {
    headers: allHeaders,
    method,
  };
  if (method !== 'GET' && data !== undefined) {
    fetchConfig.body = data;
  }

  if (debug) {
    Log.warn('Request config:');
    Log.warn(JSON.stringify(fetchConfig, null, 2));
  }
  // Try to send
  try {
    const result = await fetchMethod(url, fetchConfig, timeout, dataDirectory, debug);
    if (debug) {
      Log.warn('Request result:');
      Log.warn(JSON.stringify(result, null, 2));
    }
    return result;
  } catch (error) {
    if (error.type === 'aborted') {
      return {
        error: 'aborted',
        message: 'Request time has been exceeded',
      };
    }
  }
};

module.exports = SendHTTPrequest;
