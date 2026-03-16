import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your local IPv4 address if running on a physical device.
// 10.0.2.2 is the alias for host machine's localhost from Android emulator.
export const BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Most APIs use Bearer prefix
        // Alternatively, if the backend expects just the token without 'Bearer', adjust this.
        // Wait, some backends use cookie token or Authorization header. 
        // Based on typical authMiddleware structure: req.headers.authorization?.split(' ')[1] or req.cookies.token.
        // I will use Bearer token.
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
