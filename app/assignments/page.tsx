"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BookOpen, Calendar, CheckCircle2, Trash2, Upload } from "lucide-react";
import { Button, Card, LoadingSpinner } from "@/components/ui";
import { PageHeader } from "@/components/edusphere";

type Assignment = {
  id: string;
  title: string;
  dueDate: string | null;
  course: { id: string; title: string };
  submission?: { id: string; content: string | null; status: string } | null;
  submissionsCount?: number;
};

export default function AssignmentsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({ title: "", dueDate: "", courseId: "" });
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const isTeacher = useMemo(
    () => session?.user?.role === "TEACHER" || session?.user?.role === "ADMIN",
    [session],
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status !== "authenticated") return;

    fetchAssignments();

    if (isTeacher) {
      fetch("/api/courses")
        .then((response) => response.json())
        .then((data) => setCourses(data.map((item: { id: string; title: string }) => ({ id: item.id, title: item.title }))))
        .catch(() => setCourses([]));
    }
  }, [isTeacher, router, status]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/assignments");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Impossible de charger les devoirs");
      setAssignments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.courseId) {
      setError("Le titre et le cours sont requis.");
      return;
    }

    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          courseId: form.courseId,
          dueDate: form.dueDate || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur lors de la création");
      setForm({ title: "", dueDate: "", courseId: "" });
      await fetchAssignments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  const handleSubmitAssignment = async (assignmentId: string) => {
    const content = drafts[assignmentId]?.trim();
    if (!content) {
      setError("Votre réponse ne peut pas être vide.");
      return;
    }

    setSending((current) => ({ ...current, [assignmentId]: true }));
    setError("");

    try {
      const response = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Soumission impossible");
      await fetchAssignments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSending((current) => ({ ...current, [assignmentId]: false }));
    }
  };

  const handleDelete = async (assignmentId: string) => {
    if (!confirm("Supprimer ce devoir ?")) return;

    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Suppression impossible");
      await fetchAssignments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen grid place-items-center"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <PageHeader
          title="Devoirs"
          description={isTeacher ? "Créez, suivez et gérez les devoirs de vos cours." : "Consultez les devoirs et soumettez vos réponses."}
        />

        {isTeacher && (
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-5">Créer un devoir</h2>
            <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cours</label>
                <select
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Choisir un cours</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Ex: Développement d'un dashboard"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date limite</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <Button type="submit">Ajouter le devoir</Button>
              </div>
            </form>
          </Card>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {assignments.length === 0 ? (
            <Card className="text-center py-12">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-gray-600">Aucun devoir pour le moment.</p>
            </Card>
          ) : (
            assignments.map((assignment) => (
              <Card key={assignment.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide">{assignment.course.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{assignment.title}</h3>
                  </div>

                  {isTeacher && (
                    <Button variant="danger" size="sm" onClick={() => handleDelete(assignment.id)} className="gap-2">
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" />{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString("fr-FR") : "Aucune date"}</span>
                  {isTeacher && <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{assignment.submissionsCount ?? 0} soumissions</span>}
                </div>

                {!isTeacher ? (
                  <div className="mt-6 space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Votre réponse</label>
                    <textarea
                      value={drafts[assignment.id] ?? assignment.submission?.content ?? ""}
                      onChange={(e) => setDrafts((current) => ({ ...current, [assignment.id]: e.target.value }))}
                      rows={5}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Décrivez votre travail ou joignez votre réponse..."
                    />

                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-gray-600">
                        {assignment.submission ? `Statut : ${assignment.submission.status}` : "Aucune soumission pour le moment"}
                      </span>

                      <Button
                        size="sm"
                        onClick={() => handleSubmitAssignment(assignment.id)}
                        isLoading={sending[assignment.id]}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Soumettre
                      </Button>
                    </div>
                  </div>
                ) : null}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
