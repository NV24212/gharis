import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ghars-api.hasmah.xyz/api/v1',
  headers: {
    'X-API-KEY': 'a_very_secret_api_key',
  },
});

// Function to set the authorization token on the api instance
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;