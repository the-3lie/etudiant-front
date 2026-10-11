"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { scheduleService } from "@/services/schedule.service";
import type { ScheduleEntry } from "@/types";
import { EmptyState, Spinner } from "@/components/ui/primitives";
import { useExistingUser } from "@/providers/UserProvider";

const dayOrder = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export default function EmploiDuTempsPage() {
  const { loading: authLoading, error: authError } = useExistingUser();
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (authError) {
      setLoading(false);
      return;
    }
    scheduleService
      .getWeeklySchedule()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [authLoading, authError]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="Emploi du temps vide"
        description="Aucun cours n'est encore programmé."
      />
    );
  }

  const byDay = dayOrder
    .map((jour) => ({
      jour,
      cours: entries
        .filter((e) => e.jour === jour)
        .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut)),
    }))
    .filter((g) => g.cours.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <p className="font-display text-lg text-ink">Emploi du temps</p>
      {byDay.map(({ jour, cours }) => (
        <div key={jour}>
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-soft/50">
            {jour}
          </p>
          <ul className="flex flex-col gap-2">
            {cours.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-card bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{c.matiere}</p>
                  <p className="text-xs text-ink-soft/60">{c.enseignant}</p>
                </div>
                <div className="text-right text-xs text-ink-soft/60">
                  <p>
                    {c.heureDebut} – {c.heureFin}
                  </p>
                  <p className="flex items-center justify-end gap-1">
                    <MapPin size={12} />
                    {c.salle}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
