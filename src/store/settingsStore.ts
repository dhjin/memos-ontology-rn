import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  SERVER_URL: 'server_url',
  FUSEKI_URL: 'fuseki_url',
  FUSEKI_USER: 'fuseki_user',
  FUSEKI_PASS: 'fuseki_pass',
  IS_LOGGED_IN: 'is_logged_in',
};

// Sensitive fields use SecureStore; non-sensitive use AsyncStorage
export const settingsStore = {
  async getServerUrl() {
    return (await AsyncStorage.getItem(KEYS.SERVER_URL)) || '';
  },
  async setServerUrl(url: string) {
    await AsyncStorage.setItem(KEYS.SERVER_URL, url);
  },
  async getFusekiUrl() {
    return (await AsyncStorage.getItem(KEYS.FUSEKI_URL)) || '';
  },
  async setFusekiUrl(url: string) {
    await AsyncStorage.setItem(KEYS.FUSEKI_URL, url);
  },
  async getFusekiUser() {
    return (await AsyncStorage.getItem(KEYS.FUSEKI_USER)) || '';
  },
  async setFusekiUser(user: string) {
    await AsyncStorage.setItem(KEYS.FUSEKI_USER, user);
  },
  async getFusekiPassword() {
    return (await SecureStore.getItemAsync(KEYS.FUSEKI_PASS)) || '';
  },
  async setFusekiPassword(pass: string) {
    await SecureStore.setItemAsync(KEYS.FUSEKI_PASS, pass);
  },
  async isLoggedIn() {
    return (await AsyncStorage.getItem(KEYS.IS_LOGGED_IN)) === 'true';
  },
  async setLoggedIn(value: boolean) {
    await AsyncStorage.setItem(KEYS.IS_LOGGED_IN, value.toString());
  },
  async clear() {
    // Only remove app-owned keys, not the entire namespace
    await AsyncStorage.multiRemove(Object.values(KEYS).filter(k => k !== KEYS.FUSEKI_PASS));
    await SecureStore.deleteItemAsync(KEYS.FUSEKI_PASS);
  }
};
