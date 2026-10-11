import { api } from "./api";

export interface LoginResponse {
  accessToken: string;
  etudiant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const authService = {
  /**
   * POST /api/etudiant/auth/login
   * Connexion locale par email + mot de passe.
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/api/etudiant/auth/login", {
      email,
      password,
    });
    return data;
  },
};
