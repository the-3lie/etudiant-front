"use client";

import { useEffect, useState } from "react";
import { BookOpen, MapPin } from "lucide-react";
import { scheduleService } from "@/services/schedule.service";
import type { CourseSummary } from "@/types";
import { EmptyState, Spinner } from "@/components/ui/primitives";
import { useExistingUser } from "@/providers/UserProvider";

export default function CoursPage() {
  const { loading: authLoading, error: authError } = useExistingUser();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (authError) {
      setLoading(false);
      return;
    }
    scheduleService
      .getCourses()
      .then(setCourses)
      .finally(() => setLoading(false));
  }, [authLoading, authError]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Aucun cours"
        description="Vos cours apparaîtront ici."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-display text-lg text-ink">Mes cours</p>
      <ul className="flex flex-col gap-2">
        {courses.map((c) => (
          <li key={c.id} className="rounded-card bg-white px-4 py-3">
            <p className="text-sm font-medium text-ink">{c.matiere}</p>
            <p className="text-xs text-ink-soft/60">{c.enseignant}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-ink-soft/60">
              <span>
                {c.date} · {c.heureDebut}–{c.heureFin}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {c.salle}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
