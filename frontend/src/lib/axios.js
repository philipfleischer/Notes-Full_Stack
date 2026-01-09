import axios from 'axios';

const api = axios.create({
  baseURL: 'http://loaclhost:5001/api',
});

export default api;
