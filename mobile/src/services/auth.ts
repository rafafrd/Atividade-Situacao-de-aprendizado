import * as SecureStore from 'expo-secure-store';
import { apiPost } from './api';

const TOKEN_KEY = 'stockplus_auth_token';

interface LoginResponse {
  message: string;
  data: { accessToken: string };
}

export async function login(username: string, password: string): Promise<void> {
  const response = await apiPost<LoginResponse>('/autenticacao/login', {
    username: username.trim(),
    password,
  });
  await SecureStore.setItemAsync(TOKEN_KEY, response.data.accessToken);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
