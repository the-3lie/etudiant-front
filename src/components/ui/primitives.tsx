import type { LucideIcon } from "lucide-react";
import clsx from "@/lib/clsx";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "h-5 w-5 animate-spin rounded-full border-2 border-ink/20 border-t-ink",
        className
      )}
      role="status"
      aria-label="Chargement"
    />
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-ink/15 px-6 py-10 text-center">
      <Icon size={28} className="text-ink-soft/50" />
      <p className="font-display text-base text-ink">{title}</p>
      <p className="text-sm text-ink-soft/70">{description}</p>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  present: "bg-sage-soft text-sage",
  absent: "bg-rust-soft text-rust",
  retard: "bg-gold-soft text-gold",
  justifie: "bg-ink/10 text-ink-soft",
};

const statusLabels: Record<string, string> = {
  present: "Présent",
  absent: "Absent",
  retard: "Retard",
  justifie: "Justifié",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "rounded-full px-2.5 py-1 text-xs font-medium",
        statusStyles[status] ?? "bg-ink/10 text-ink-soft"
      )}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
