import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from './baseUrl';
const axiosInstance = axios.create({
  baseURL: 'https://api.shareecare.com/sec/',

});

axiosInstance.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized (e.g., log out user or refresh token)
        console.error('Unauthorized - please log in again.');
      } else if (error.response.status >= 500) {
        console.error('Server error - try again later.');
      }
    } else {
      console.error('Network error - check your connection.');
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
