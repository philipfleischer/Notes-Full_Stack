import axios from 'axios';

// In production, there is no localhost, THEREFORE I need to make it dynamic
// The one using this, will import the current URL and use that!
const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
