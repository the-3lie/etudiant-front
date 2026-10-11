"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import {
  attendanceService,
  type AttendanceFilters,
} from "@/services/attendance.service";
import type { AttendanceRecord } from "@/types";
import { EmptyState, Spinner, StatusBadge } from "@/components/ui/primitives";
import { useExistingUser } from "@/providers/UserProvider";

const statusOptions = [
  { value: "", label: "Tous" },
  { value: "present", label: "Présent" },
  { value: "absent", label: "Absent" },
  { value: "retard", label: "Retard" },
  { value: "justifie", label: "Justifié" },
];

export default function PresencesPage() {
  const { loading: authLoading, error: authError } = useExistingUser();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AttendanceFilters>({});

  useEffect(() => {
    if (authLoading) return;
    if (authError) {
      setLoading(false);
      return;
    }
    setLoading(true);
    attendanceService
      .getHistory(filters)
      .then((res) => setRecords(res.records))
      .finally(() => setLoading(false));
  }, [filters, authLoading, authError]);

  return (
    <div className="flex flex-col gap-4">
      <p className="font-display text-lg text-ink">Mes présences</p>

      <div className="flex flex-col gap-2">
        <input
          type="date"
          value={filters.date ?? ""}
          onChange={(e) =>
            setFilters((f) => ({ ...f, date: e.target.value || undefined }))
          }
          className="rounded-card border border-ink/10 bg-white px-4 py-2.5 text-sm"
        />
        <input
          type="text"
          placeholder="Filtrer par matière"
          value={filters.matiere ?? ""}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              matiere: e.target.value || undefined,
            }))
          }
          className="rounded-card border border-ink/10 bg-white px-4 py-2.5 text-sm"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                setFilters((f) => ({ ...f, statut: opt.value || undefined }))
              }
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs ${
                (filters.statut ?? "") === opt.value
                  ? "bg-ink text-paper"
                  : "bg-white text-ink-soft/70"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : records.length === 0 ? (
        <EmptyState
          icon={History}
          title="Aucun résultat"
          description="Aucune présence ne correspond à ces filtres."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {records.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between rounded-card bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-ink">{r.matiere}</p>
                <p className="text-xs text-ink-soft/60">
                  {r.enseignant} · {r.date} · {r.heure}
                </p>
              </div>
              <StatusBadge status={r.statut} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
