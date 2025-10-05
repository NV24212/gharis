import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ghars-api.hasmah.xyz/api/v1',
});

// Function to set the authorization token on the api instance
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const classService = {
  getAllClasses: async () => {
    const response = await api.get('/admin/classes');
    return response.data;
  },
  createClass: async (classData) => {
    const response = await api.post('/admin/classes', classData);
    return response.data;
  },
  deleteClass: async (classId) => {
    const response = await api.delete(`/admin/classes/${classId}`);
    return response.data;
  },
};

export const weekService = {
  getAllWeeks: async () => {
    const response = await api.get('/weeks/'); // Added trailing slash
    return response.data;
  },
};

export default api;