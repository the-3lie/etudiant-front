import { Clock, MapPin } from "lucide-react";
import type { AttendanceStats, CourseSummary } from "@/types";

export function StatsCard({ stats }: { stats: AttendanceStats }) {
  return (
    <div className="rounded-card bg-ink px-5 py-5 text-paper">
      <div className="flex items-baseline justify-between">
        <p className="font-display text-4xl">{stats.tauxPresence}%</p>
        <p className="text-xs text-paper/60">taux de présence</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-paper/70">
        <div>
          <p className="font-display text-lg text-paper">
            {stats.presences}
          </p>
          présences
        </div>
        <div>
          <p className="font-display text-lg text-paper">{stats.retards}</p>
          retards
        </div>
        <div>
          <p className="font-display text-lg text-paper">{stats.absences}</p>
          absences
        </div>
      </div>
    </div>
  );
}

export function NextCourseCard({ course }: { course: CourseSummary | null }) {
  if (!course) {
    return (
      <div className="rounded-card border border-ink/10 bg-white px-5 py-4">
        <p className="text-xs uppercase tracking-wide text-ink-soft/50">
          Prochain cours
        </p>
        <p className="mt-1 text-sm text-ink-soft/70">
          Aucun cours à venir aujourd&apos;hui.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-card border border-ink/10 bg-white px-5 py-4">
      <p className="text-xs uppercase tracking-wide text-ink-soft/50">
        Prochain cours
      </p>
      <p className="mt-1 font-display text-lg text-ink">{course.matiere}</p>
      <p className="text-sm text-ink-soft/70">{course.enseignant}</p>
      <div className="mt-3 flex items-center gap-4 text-xs text-ink-soft/60">
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {course.heureDebut} – {course.heureFin}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {course.salle}
        </span>
      </div>
    </div>
  );
}

export function TodayCoursesList({ courses }: { courses: CourseSummary[] }) {
  if (courses.length === 0) {
    return (
      <p className="rounded-card bg-white px-5 py-4 text-sm text-ink-soft/60">
        Pas de cours programmé aujourd&apos;hui.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {courses.map((course) => (
        <li
          key={course.id}
          className="flex items-center justify-between rounded-card bg-white px-4 py-3"
        >
          <div>
            <p className="text-sm font-medium text-ink">{course.matiere}</p>
            <p className="text-xs text-ink-soft/60">{course.enseignant}</p>
          </div>
          <div className="text-right text-xs text-ink-soft/60">
            <p>{course.heureDebut}</p>
            <p>{course.salle}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
