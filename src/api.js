import axios from 'axios';
import { config } from './config';

const api = axios.create({
  baseURL: config.apiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      if (!window.location.pathname.includes('/login')) {
        window.location.href = `/login?redirect=${window.location.pathname}`;
      }
    } else if (status === 500) {
      window.location.href = '/error/500';
    }

    return Promise.reject(error);
  }
);

export const auth = {
  login: (username, password) => api.post('auth/login', { username, password }),
  register: (username, email, password) => api.post('auth/register', { username, email, password }),
  me: () => api.get('auth/me'),
  updateProfile: (data) => api.put('auth/profile', data),
  googleLogin: (credential) => api.post('auth/google-login', { credential }),
  forgotPassword: (email) => api.post('auth/forgot-password', { email }),
  verifyResetCode: (email, code) => api.post('auth/verify-reset-code', { email, code }),
  resetPassword: (email, code, newPassword) => api.post('auth/reset-password', { email, code, newPassword }),
  getMyReviews: () => api.get('auth/my-reviews'),
};

export const products = {
  getAll: (params) => api.get('products', { params }),
  getOne: (id) => api.get(`products/${id}`),
  create: (data) => api.post('products', data),
  update: (id, data) => api.put(`products/${id}`, data),
  delete: (id) => api.delete(`products/${id}`),
  like: (id) => api.post(`products/${id}/like`),
  addComment: (id, text, image) => api.post(`products/${id}/comments`, { text, image }),
};

export const categories = {
  getAll: () => api.get('categories'),
  create: (data) => api.post('categories', data),
  update: (id, data) => api.put(`categories/${id}`, data),
  delete: (id) => api.delete(`categories/${id}`),
};

export const orders = {
  getAll: () => api.get('orders'),
  getAdmin: () => api.get('orders/admin'),
  getOne: (id) => api.get(`orders/${id}`),
  create: (data) => api.post('orders', data),
  oneClickBuy: (data) => api.post('orders/one-click', data),
  updateStatus: (id, status) => api.put(`orders/${id}/status`, { status }),
  cancel: (id) => api.put(`orders/${id}/cancel`),
};

export const stats = {
  get: () => api.get('stats'),
};

export const admin = {
  getUsers: () => api.get('users'),
  deleteUser: (id) => api.delete(`users/${id}`),
  deleteReview: (productId, index) => api.delete(`products/${productId}/comments/${index}`),
};

export const promo = {
  validate: (code) => api.post('promo/validate', { code }),
  getAllAdmin: () => api.get('promo/admin'),
  createAdmin: (data) => api.post('promo/admin', data),
  updateAdmin: (id, data) => api.put(`promo/admin/${id}`, data),
  deleteAdmin: (id) => api.delete(`promo/admin/${id}`),
};

export const blogs = {
  getAll: () => api.get('blogs'),
  getOne: (id) => api.get(`blogs/${id}`),
  create: (data) => api.post('blogs', data),
};

export const demo = {
  seed: () => api.post('demo/seed')
};

export const notifications = {
  getAll: () => api.get('notifications'),
  markAsRead: (id) => api.patch(`notifications/${id}/read`),
  markAllRead: () => api.patch('notifications/read-all'),
  broadcast: (data) => api.post('notifications/broadcast', data),
};

export const superAdmin = {
  updateUserRole: (id, role) => api.patch(`super-admin/users/${id}/role`, { role }),
  getLogs: () => api.get('super-admin/logs'),
};

export const ads = {
  getAll: () => api.get('ads'),
  getAdmin: () => api.get('ads/admin'),
  create: (data) => api.post('ads', data),
  update: (id, data) => api.put(`ads/${id}`, data),
  delete: (id) => api.delete(`ads/${id}`),
};

export default api;