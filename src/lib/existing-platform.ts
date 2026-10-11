import type { ExistingPlatformUser } from "@/types";

/**
 * Couche d'abstraction pour récupérer l'identité de l'étudiant
 * déjà connecté sur la plateforme universitaire existante.
 *
 * IMPORTANT : cette application NE GÈRE AUCUNE AUTHENTIFICATION.
 * Elle ne fait que lire l'identité déjà établie ailleurs.
 *
 * La stratégie réelle (cookie de session partagé, token transmis en query
 * string à l'ouverture, redirection SSO, ou endpoint "/me" côté plateforme)
 * dépend de la plateforme universitaire cible. Cette couche est volontairement
 * un point d'extension unique : un seul fichier à adapter, aucun autre endroit
 * du code ne doit connaître le mécanisme choisi.
 */

export type IdentityStrategy = "cookie" | "token" | "sso" | "endpoint";

const PLATFORM_URL = (process.env.NEXT_PUBLIC_EXISTING_PLATFORM_URL ?? "").replace(
  /\/+$/,
  ""
);
const STRATEGY = (process.env.NEXT_PUBLIC_IDENTITY_STRATEGY ??
  "endpoint") as IdentityStrategy;

class ExistingPlatformError extends Error {}

/**
 * Point d'entrée unique utilisé par le reste de l'application
 * (via useExistingUser / UserProvider) pour obtenir l'utilisateur courant.
 */
export async function getCurrentExistingUser(): Promise<ExistingPlatformUser> {
  switch (STRATEGY) {
    case "cookie":
      return getUserViaSharedCookieSession();
    case "token":
      return getUserViaUrlToken();
    case "sso":
      return getUserViaSsoRedirect();
    case "endpoint":
    default:
      return getUserViaPlatformEndpoint();
  }
}

/**
 * Stratégie "endpoint" : appelle la propre route serveur de student-app
 * (/api/me), qui relaie elle-même la requête vers la plateforme existante.
 * Ce détour évite tout blocage CORS (un appel serveur-à-serveur n'y est
 * jamais soumis) et évite d'avoir à renseigner l'URL de la plateforme
 * côté frontend : elle est configurée une seule fois, côté serveur, dans
 * src/app/api/me/route.ts.
 */
async function getUserViaPlatformEndpoint(): Promise<ExistingPlatformUser> {
  const res = await fetch("/api/me", {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new ExistingPlatformError(
      `Impossible de récupérer l'utilisateur (statut ${res.status}).`
    );
  }
  return normalizePlatformPayload(await res.json());
}

/**
 * Stratégie "cookie" : un cookie de session partagé entre la plateforme
 * existante et cette app permet d'appeler directement l'API centrale,
 * qui se charge de résoudre l'identité côté backend.
 */
async function getUserViaSharedCookieSession(): Promise<ExistingPlatformUser> {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  const res = await fetch(`${apiUrl}/api/etudiant/profil`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new ExistingPlatformError("Session non reconnue par l'API.");
  }
  return normalizePlatformPayload(await res.json());
}

/**
 * Stratégie "token" : la plateforme ouvre cette app avec un token
 * dans l'URL (ex: ?platformToken=...), que l'on échange contre l'identité.
 */
async function getUserViaUrlToken(): Promise<ExistingPlatformUser> {
  if (typeof window === "undefined") {
    throw new ExistingPlatformError("Indisponible côté serveur.");
  }
  const params = new URLSearchParams(window.location.search);
  const token = params.get("platformToken");
  if (!token) {
    throw new ExistingPlatformError(
      "Aucun token de plateforme trouvé dans l'URL."
    );
  }
  const res = await fetch(`${PLATFORM_URL}/api/identity/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    throw new ExistingPlatformError("Échange de token échoué.");
  }
  return normalizePlatformPayload(await res.json());
}

/**
 * Stratégie "sso" : point d'extension pour une redirection SSO
 * (OAuth2 / SAML) gérée par la plateforme existante.
 */
async function getUserViaSsoRedirect(): Promise<ExistingPlatformUser> {
  throw new ExistingPlatformError(
    "Stratégie SSO non implémentée — à brancher sur le fournisseur SSO de l'établissement."
  );
}

function normalizePlatformPayload(payload: any): ExistingPlatformUser {
  return {
    externalUserId: payload.externalUserId ?? payload.id ?? "",
    nom: payload.nom ?? payload.lastName ?? "",
    prenom: payload.prenom ?? payload.firstName ?? "",
    email: payload.email ?? "",
    matricule: payload.matricule ?? payload.studentId ?? "",
    classe: payload.classe ?? payload.class ?? "",
    filiere: payload.filiere ?? payload.program ?? "",
    niveau: payload.niveau ?? payload.level ?? "",
    etablissement: payload.etablissement ?? payload.institution ?? "",
    avatarUrl: payload.avatarUrl,
  };
}
