const SendHTTPrequest = require('../common/requestWrapper');
const Log = require('../common/logger');

// Try get
const getRequest = async () => {
  const dogImage = await SendHTTPrequest({
    url: 'https://dog.ceo/api/breeds/image/random',
    method: 'GET',
    timeout: 2000,
    data: {},
  });
  if (dogImage.status === 200) {
    const result = await SendHTTPrequest({
      url: dogImage.data.message,
      method: 'GET',
      timeout: 4000,
      dataDirectory: 'data/',
    });
    if (result.data) {
      Log(result.data);
    } else {
      Log.error(result);
    }
  } else {
    Log.error(dogImage);
  }
};

getRequest();
