let successAudio: HTMLAudioElement | null = null;

export function playSuccessSound() {
  if (typeof window === "undefined") return;
  if (!successAudio) {
    successAudio = new Audio("/sounds/success.mp3");
  }
  successAudio.currentTime = 0;
  successAudio.play().catch(() => {
    // La lecture automatique peut être bloquée par le navigateur
    // tant qu'il n'y a pas eu d'interaction utilisateur — ignoré.
  });
}
