import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ghars-api.hasmah.xyz/api/v1',
});

// Add a request interceptor to automatically add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
    const response = await api.get('/weeks/');
    return response.data;
  },
  uploadWeekVideo: async (weekId, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/admin/weeks/${weekId}/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onUploadProgress) {
          onUploadProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },
};

export default api;