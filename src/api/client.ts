import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { settingsStore } from '../store/settingsStore';

const jar = new CookieJar();
const client = wrapper(axios.create({
  jar,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
}));

client.interceptors.request.use(async (config) => {
  const baseURL = await settingsStore.getServerUrl();
  if (baseURL) {
    // Basic URL format validation to prevent SSRF with arbitrary schemes
    if (!/^https?:\/\/.+/.test(baseURL)) {
      return Promise.reject(new Error('Server URL must start with http:// or https://'));
    }
    config.baseURL = baseURL;
  }
  return config;
});

export default client;
