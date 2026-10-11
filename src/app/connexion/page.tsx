"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useExistingUser } from "@/providers/UserProvider";
import { Spinner } from "@/components/ui/primitives";

export default function ConnexionPage() {
  const { user, loading, login } = useExistingUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/etudiant/dashboard");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.replace("/etudiant/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Email ou mot de passe incorrect."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-paper px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper">
            <LogIn size={20} />
          </div>
          <p className="font-display text-2xl text-ink">Espace étudiant</p>
          <p className="mt-1 text-sm text-ink-soft/60">
            Connectez-vous avec votre email universitaire.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft/60">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom.nom@etablissement.edu"
              className="w-full rounded-card border border-ink/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-ink/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft/60">
              Mot de passe
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-card border border-ink/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-ink/30"
            />
          </div>

          {error && (
            <p className="rounded-card bg-rust-soft px-3 py-2 text-xs text-rust">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-medium text-paper disabled:opacity-60"
          >
            {submitting ? <Spinner className="h-4 w-4 border-paper/30 border-t-paper" /> : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
