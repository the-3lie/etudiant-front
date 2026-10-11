import { api } from "./api";
import type { NotificationItem } from "@/types";

export const notificationService = {
  /** GET /api/etudiant/notifications */
  async getAll(): Promise<NotificationItem[]> {
    const { data } = await api.get<NotificationItem[]>(
      "/api/etudiant/notifications"
    );
    return data;
  },
};
