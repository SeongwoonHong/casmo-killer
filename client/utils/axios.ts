import axios from 'axios';

const baseURL = 'http://localhost:9000';

axios.defaults.baseURL = baseURL + '/api';

export { axios };
