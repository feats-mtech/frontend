import axios, { AxiosInstance } from 'axios';

export const checkStatus = (code: number): boolean => code >= 200 && code < 300;

const axiosInstance: AxiosInstance = axios.create({ baseURL: `http:localhost` });
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  console.log('token', token);
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
export default axiosInstance;
