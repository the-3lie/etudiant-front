"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import type { ScanResult } from "@/types";

const errorMessages: Record<string, string> = {
  QR_INVALIDE: "Ce QR Code n'est pas reconnu.",
  QR_EXPIRE: "Ce QR Code a expiré. Demandez au professeur d'en régénérer un.",
  SESSION_FERMEE: "La session de présence est fermée.",
  MAUVAISE_CLASSE: "Ce QR Code ne correspond pas à votre classe.",
  ETUDIANT_NON_AUTORISE: "Vous n'êtes pas autorisé à valider cette présence.",
  DEJA_PRESENT: "Votre présence a déjà été enregistrée pour ce cours.",
  ERREUR_SERVEUR: "Une erreur serveur est survenue. Réessayez.",
};

export function ResultOverlay({
  result,
  onClose,
}: {
  result: ScanResult;
  onClose: () => void;
}) {
  const isSuccess = result.status === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 px-4 pb-8 sm:items-center">
      <div className="animate-stamp-in w-full max-w-sm rounded-card bg-white p-6 text-center shadow-xl">
        {isSuccess ? (
          <>
            <CheckCircle2 size={52} className="mx-auto text-sage" />
            <p className="mt-3 font-display text-xl text-ink">
              Présence validée
            </p>
            <dl className="mt-4 space-y-1.5 text-left text-sm text-ink-soft">
              <Row label="Matière" value={result.matiere} />
              <Row label="Enseignant" value={result.enseignant} />
              <Row label="Date" value={result.date} />
              <Row label="Heure" value={result.heure} />
              <Row label="Salle" value={result.salle} />
            </dl>
          </>
        ) : (
          <>
            <XCircle size={52} className="mx-auto text-rust" />
            <p className="mt-3 font-display text-xl text-ink">
              Présence non validée
            </p>
            <p className="mt-2 text-sm text-ink-soft/80">
              {errorMessages[result.code] ?? result.message}
            </p>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-medium text-paper"
        >
          {isSuccess ? "Terminer" : "Réessayer"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-ink/5 pb-1.5">
      <dt className="text-ink-soft/50">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
