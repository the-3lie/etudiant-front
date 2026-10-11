import { api } from "./api";
import type { CourseSummary, ScheduleEntry } from "@/types";

export const scheduleService = {
  /** GET /api/etudiant/emploi-du-temps */
  async getWeeklySchedule(): Promise<ScheduleEntry[]> {
    const { data } = await api.get<ScheduleEntry[]>(
      "/api/etudiant/emploi-du-temps"
    );
    return data;
  },

  /** GET /api/etudiant/cours */
  async getCourses(): Promise<CourseSummary[]> {
    const { data } = await api.get<CourseSummary[]>("/api/etudiant/cours");
    return data;
  },
};
