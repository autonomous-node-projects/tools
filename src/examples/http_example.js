const SendHTTPrequest = require('../common/requestWrapper');
const Log = require('../common/logger');

// Try get
const getRequest = async () => {
  const dogImage = await SendHTTPrequest({
    url: 'https://dog.ceo/api/breeds/image/random',
    method: 'GET',
    timeout: 1000,
    data: {},
  });

  const result = await SendHTTPrequest({
    url: dogImage.data.message,
    method: 'GET',
    timeout: 1000,
    dataDirectory: 'data/',
    debug: true,
  });

  Log(result.data);
};

getRequest();
