"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Card, Input } from "@/components/ui";

export default function NewCoursePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ title: "", description: "", level: "BEGINNER", category: "TECH" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") return null;
  if (status === "unauthenticated" || !session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    router.replace("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Impossible de créer le cours");
      }

      router.push("/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <div className="mb-8">
            <p className="text-sm uppercase tracking-wide text-blue-600 font-semibold">Création de cours</p>
            <h1 className="text-3xl font-bold mt-2">Nouveau cours</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Titre du cours"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex : Scrum et gestion de projet"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-28"
                placeholder="Décrivez le cours, ses objectifs et le public visé"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TECH">TECH</option>
                  <option value="BUSINESS">BUSINESS</option>
                  <option value="LANGUAGE">LANGUAGE</option>
                  <option value="ART">ART</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="secondary" onClick={() => router.push("/courses")}>
                Annuler
              </Button>
              <Button type="submit" isLoading={loading}>
                Créer le cours
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
