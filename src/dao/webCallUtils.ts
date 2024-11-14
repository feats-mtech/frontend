import axios, { AxiosInstance } from 'axios';

import { useAuth } from 'src/context/AuthContext';

export const checkStatus = (code: number): boolean => code >= 200 && code < 300;

const axiosInstance: AxiosInstance = axios.create({});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  const userId = localStorage.getItem('userId');
  if (userId && config.headers) {
    config.headers['userId'] = `${userId}`;
  }
  return config;
});
export default axiosInstance;
