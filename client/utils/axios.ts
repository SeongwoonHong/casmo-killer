import axios from 'axios';

const baseURL = 'https://damso-auth-service.herokuapp.com';

axios.defaults.baseURL = baseURL + '/api';

function setTokenToHeader(header, csrfToken) {
  axios.defaults.headers.common[header] = csrfToken;
}

export { axios, setTokenToHeader };
