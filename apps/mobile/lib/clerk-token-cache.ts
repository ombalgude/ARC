import type { TokenCache } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, token: string) {
    await SecureStore.setItemAsync(key, token);
  },
  async clearToken(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};
