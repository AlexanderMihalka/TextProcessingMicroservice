import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: `${API_URL}/api` });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401 (expired or invalid token).
// Login and register requests are skipped: a 401 there means "wrong email or password",
// and the page has to stay put to show that message.
const isAuthForm = (url = '') => url.startsWith('/auth/login') || url.startsWith('/auth/register');

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !isAuthForm(error.config?.url) && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Text Processing
export const textApi = {
  transliterate: (text, direction) => api.post('/text/transliterate', { text, direction }),
  translate: (text, sourceLang, targetLang) => api.post('/text/translate', { text, sourceLang, targetLang }),
  normalize: (text, options) => api.post('/text/normalize', { text, options }),
  detect: (text) => api.post('/text/detect', { text }),
  history: (page = 1, limit = 20) => api.get(`/text/history?page=${page}&limit=${limit}`),
  languages: () => api.get('/text/languages'),
};

// Admin
export const adminApi = {
  users: () => api.get('/admin/users'),
  toggleBlock: (id) => api.patch(`/admin/users/${id}/block`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  changeRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  stats: () => api.get('/admin/stats'),
  logs: (page = 1) => api.get(`/admin/logs?page=${page}`),
  clearHistory: () => api.delete('/admin/history'),
};

export default api;
