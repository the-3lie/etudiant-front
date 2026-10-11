import { api } from "./api";
import type { AttendanceRecord, AttendanceStats, ScanResult } from "@/types";

export interface AttendanceFilters {
  date?: string;
  matiere?: string;
  statut?: string;
}

export const attendanceService = {
  /**
   * GET /api/etudiant/presences
   */
  async getHistory(filters: AttendanceFilters = {}): Promise<{
    records: AttendanceRecord[];
    stats: AttendanceStats;
  }> {
    const { data } = await api.get("/api/etudiant/presences", {
      params: filters,
    });
    return data;
  },

  /**
   * POST /api/etudiant/presences/scan
   *
   * IMPORTANT : le frontend ne valide JAMAIS une présence lui-même.
   * Il transmet uniquement le token lu depuis le QR Code et affiche
   * le résultat renvoyé par le backend.
   */
  async submitScan(qrToken: string): Promise<ScanResult> {
    try {
      const { data } = await api.post<ScanResult>(
        "/api/etudiant/presences/scan",
        { token: qrToken }
      );
      return data;
    } catch (error: any) {
      const backendResult = error?.response?.data as ScanResult | undefined;
      if (backendResult?.status === "error") {
        return backendResult;
      }
      return {
        status: "error",
        code: "ERREUR_SERVEUR",
        message: "Impossible de contacter le serveur. Réessayez.",
      };
    }
  },
};
