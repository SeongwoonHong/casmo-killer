import axios from 'axios';

const baseURL = 'http://localhost:9000';

axios.defaults.baseURL = baseURL + '/api';

function setTokenToHeader(header, csrfToken) {
  axios.defaults.headers.common[header] = csrfToken;
}

export { axios, setTokenToHeader };
