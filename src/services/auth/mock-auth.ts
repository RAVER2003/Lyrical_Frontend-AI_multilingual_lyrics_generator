import axios from 'axios';
import Keycloak from 'keycloak-js';

export const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'lyrical-realm',
  clientId: 'lyrical-frontend'
});

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api'
});

apiClient.interceptors.request.use(async (config) => {
  if (keycloak.token) {
    try {
      await keycloak.updateToken(30);
    } catch(e) {
      console.log('Failed to update token', e);
    }
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

export type AuthUser = {
  id: string
  name: string
  email: string
}

