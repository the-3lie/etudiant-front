"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { notificationService } from "@/services/notification.service";
import type { NotificationItem } from "@/types";
import { EmptyState, Spinner } from "@/components/ui/primitives";
import clsx from "@/lib/clsx";
import { useExistingUser } from "@/providers/UserProvider";

export default function NotificationsPage() {
  const { loading: authLoading, error: authError } = useExistingUser();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (authError) {
      setLoading(false);
      return;
    }
    notificationService
      .getAll()
      .then(setItems)
      .finally(() => setLoading(false));
  }, [authLoading, authError]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="Aucune notification"
        description="Vous êtes à jour."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-display text-lg text-ink">Notifications</p>
      <ul className="flex flex-col gap-2">
        {items.map((n) => (
          <li
            key={n.id}
            className={clsx(
              "flex gap-3 rounded-card px-4 py-3",
              n.lu ? "bg-white" : "bg-gold-soft"
            )}
          >
            {n.lu ? (
              <Bell size={18} className="mt-0.5 text-ink-soft/40" />
            ) : (
              <BellRing size={18} className="mt-0.5 text-gold" />
            )}
            <div>
              <p className="text-sm font-medium text-ink">{n.titre}</p>
              <p className="text-xs text-ink-soft/70">{n.message}</p>
              <p className="mt-1 text-[11px] text-ink-soft/40">{n.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
