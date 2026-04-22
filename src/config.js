const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://shop-backend-mu-lemon.vercel.app/api';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://shop-backend-mu-lemon.vercel.app';

export const config = {
  apiUrl: API_BASE_URL,
  backendUrl: BACKEND_URL,
};

export default config;
