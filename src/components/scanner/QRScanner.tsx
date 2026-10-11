"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

const SCANNER_ELEMENT_ID = "qr-scanner-viewport";

interface QRScannerProps {
  /** Appelé une seule fois par lecture, avec le contenu brut du QR Code. */
  onDecode: (rawValue: string) => void;
  /** Met le scanner en pause pendant le traitement/affichage d'un résultat. */
  paused: boolean;
}

export function QRScanner({ onDecode, paused }: QRScannerProps) {
  const scannerRef = useRef<any>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function démarrer() {
      // Sur Android (Capacitor), getUserMedia n'aboutit que si la
      // permission caméra a déjà été accordée au niveau système. Sur le
      // web classique, ceci est un no-op silencieux.
      try {
        const { Camera } = await import("@capacitor/camera");
        await Camera.requestPermissions({ permissions: ["camera"] });
      } catch {
        // Web (hors Capacitor) : @capacitor/camera n'a rien à demander,
        // getUserMedia gère sa propre popup de permission navigateur.
      }

      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;
      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText: string) => {
            onDecode(decodedText);
          },
          () => {
            // Ignoré : déclenché en continu tant qu'aucun QR n'est détecté.
          }
        )
        .then(() => {
          if (!cancelled) setReady(true);
        })
        .catch(() => {
          if (!cancelled) {
            setPermissionError(
              "Impossible d'accéder à la caméra. Vérifiez les autorisations."
            );
          }
        });
    }

    démarrer();

    return () => {
      cancelled = true;
      const scanner = scannerRef.current;
      if (scanner) {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const scanner = scannerRef.current;
    if (!scanner || !ready) return;
    if (paused) {
      scanner.pause(true);
    } else {
      scanner.resume();
    }
  }, [paused, ready]);

  if (permissionError) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-card bg-rust-soft px-6 py-10 text-center">
        <AlertTriangle className="text-rust" size={28} />
        <p className="text-sm text-rust">{permissionError}</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-card bg-black">
      <div id={SCANNER_ELEMENT_ID} className="aspect-square w-full" />
      <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-paper/70" />
    </div>
  );
}
