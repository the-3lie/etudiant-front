import { api } from "./api";
import type { DashboardData, ExistingPlatformUser } from "@/types";

export const studentService = {
  /**
   * GET /api/etudiant/profil
   * Retourne le profil étudiant tel que connu par le backend central
   * (recoupé avec l'identité fournie par la plateforme existante).
   */
  async getMe(): Promise<ExistingPlatformUser> {
    const { data } = await api.get<ExistingPlatformUser>("/api/etudiant/profil");
    return data;
  },

  /**
   * GET /api/etudiant/dashboard
   * Agrège les données nécessaires au dashboard.
   */
  async getDashboard(): Promise<DashboardData> {
    const { data } = await api.get<DashboardData>("/api/etudiant/dashboard");
    return data;
  },
};
