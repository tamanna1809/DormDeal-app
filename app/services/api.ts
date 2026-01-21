import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Use localhost for iOS simulator, special IP for Android emulator
// For physical device, you need to use your machine's local IP address (e.g., http://192.168.1.5:5000)
const DEV_API_URL = "http://10.51.5.58:8000/api"; // Updated to local IP for device connectivity

const api = axios.create({
  baseURL: DEV_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
