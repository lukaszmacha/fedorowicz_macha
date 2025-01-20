import axios from 'axios';

const apiEndpoint = axios.create({
  baseURL: 'http://localhost:1331/api',
});

export default apiEndpoint;