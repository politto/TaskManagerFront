import axios from 'axios';

const  API_URL = import.meta.env.VITE_END_POINT;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;