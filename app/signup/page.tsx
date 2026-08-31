"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button, Input } from "@/components/ui";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) return setError("Le nom est requis.");
    if (!email.trim()) return setError("L&apos;email est requis.");
    if (password.length < 6) return setError("Le mot de passe doit faire au moins 6 caractères.");
    if (password !== confirmPassword) return setError("Les mots de passe ne correspondent pas.");

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        throw new Error(data?.error || "Impossible de créer le compte.");
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("La création du compte a réussi mais la connexion a échoué.");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-black bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
              E
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">EduSphere</h1>
          <p className="text-blue-100">Rejoignez notre communauté</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Créer un compte</h2>
          <p className="text-center text-gray-600 mb-8">Commencez votre parcours d’apprentissage</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Nom complet" value={name} onChange={(event) => setName(event.target.value)} placeholder="Votre nom" />
            <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="votre@email.com" />

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-12 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Input
              label="Confirmer le mot de passe"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                ⚠️ {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
              {loading ? "Création..." : "Créer mon compte"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
