import axios from "axios";

/**
 * Instance Axios unique vers l'API centrale PresenceSaaS.
 * Cette app ne possède aucun backend métier propre : tout passe par ici.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Point unique pour brancher plus tard un traitement global des erreurs
    // (401 -> renvoyer vers la plateforme existante, 5xx -> message générique, etc.)
    return Promise.reject(error);
  }
);

/**
 * Attache le jeton JWT émis par POST /api/etudiant/auth/identifier à tous
 * les appels suivants vers l'API centrale. Appelé une fois par UserProvider
 * juste après la résolution de l'identité via la plateforme existante.
 */
export function setBackendAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
