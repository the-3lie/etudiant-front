"use client";

import { useCallback, useState } from "react";
import { QRScanner } from "@/components/scanner/QRScanner";
import { ResultOverlay } from "@/components/scanner/ResultOverlay";
import { attendanceService } from "@/services/attendance.service";
import { playSuccessSound } from "@/lib/sound";
import type { ScanResult } from "@/types";
import { Spinner } from "@/components/ui/primitives";

export default function ScannerPage() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleDecode = useCallback(
    async (rawValue: string) => {
      if (processing || result) return; // évite les lectures multiples
      setProcessing(true);
      try {
        const scanResult = await attendanceService.submitScan(rawValue);
        setResult(scanResult);
        if (scanResult.status === "success") {
          playSuccessSound();
        }
      } finally {
        setProcessing(false);
      }
    },
    [processing, result]
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-display text-lg text-ink">Scanner ma présence</p>
        <p className="text-sm text-ink-soft/60">
          Placez le QR Code affiché par l&apos;enseignant dans le cadre.
        </p>
      </div>

      <QRScanner onDecode={handleDecode} paused={processing || !!result} />

      {processing && (
        <div className="flex items-center justify-center gap-2 text-sm text-ink-soft/70">
          <Spinner className="h-4 w-4" />
          Vérification en cours…
        </div>
      )}

      {result && (
        <ResultOverlay result={result} onClose={() => setResult(null)} />
      )}
    </div>
  );
}
