// ==========================================================================
// Identité étudiant — provient EXCLUSIVEMENT de la plateforme existante.
// Ne jamais étendre ce type avec des champs de compte (mot de passe, etc.)
// ==========================================================================
export interface ExistingPlatformUser {
  externalUserId: string;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  classe: string;
  filiere: string;
  niveau: string;
  etablissement: string;
  avatarUrl?: string;
}

export type AttendanceStatus = "present" | "absent" | "retard" | "justifie";

export interface CourseSummary {
  id: string;
  matiere: string;
  enseignant: string;
  salle: string;
  date: string; // ISO date
  heureDebut: string; // HH:mm
  heureFin: string; // HH:mm
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  matiere: string;
  enseignant: string;
  date: string;
  heure: string;
  statut: AttendanceStatus;
}

export interface AttendanceStats {
  totalSeances: number;
  presences: number;
  absences: number;
  retards: number;
  tauxPresence: number; // 0-100
}

export interface ScheduleEntry {
  id: string;
  jour: string; // "Lundi" ... "Dimanche"
  heureDebut: string;
  heureFin: string;
  matiere: string;
  enseignant: string;
  salle: string;
}

export type ScanErrorCode =
  | "QR_INVALIDE"
  | "QR_EXPIRE"
  | "SESSION_FERMEE"
  | "MAUVAISE_CLASSE"
  | "ETUDIANT_NON_AUTORISE"
  | "DEJA_PRESENT"
  | "ERREUR_SERVEUR";

export interface ScanSuccessResult {
  status: "success";
  matiere: string;
  enseignant: string;
  date: string;
  heure: string;
  salle: string;
}

export interface ScanErrorResult {
  status: "error";
  code: ScanErrorCode;
  message: string;
}

export type ScanResult = ScanSuccessResult | ScanErrorResult;

export interface NotificationItem {
  id: string;
  titre: string;
  message: string;
  date: string;
  lu: boolean;
}

export interface DashboardData {
  user: ExistingPlatformUser;
  prochainCours: CourseSummary | null;
  coursDuJour: CourseSummary[];
  stats: AttendanceStats;
}
