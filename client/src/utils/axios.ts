import axios from 'axios';

axios.interceptors.request.use((config) => {
  console.log(config);
  return config;
});

function setTokenToHeader(header, csrfToken) {
  axios.defaults.headers.common[header] = csrfToken;
}

export {
  axios,
  setTokenToHeader,
};
