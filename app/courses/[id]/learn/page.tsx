"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { Button, Card, LoadingSpinner } from "@/components/ui";

type Lesson = { id: string; title: string; duration: number | null };
type Course = {
  id: string;
  title: string;
  enrollment: { progress: number } | null;
  modules: { id: string; title: string; lessons: Lesson[] }[];
};

export default function LearnPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [active, setActive] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Cours indisponible");
        return response.json();
      })
      .then((data: Course) => {
        if (!data.enrollment) {
          router.replace(`/courses/${id}`);
          return;
        }
        setCourse(data);
      })
      .catch((cause: Error) => setError(cause.message));
  }, [id, router]);

  if (error) return <div className="p-12 text-center text-red-600">{error}</div>;
  if (!course) return <div className="min-h-screen grid place-items-center"><LoadingSpinner size="lg" /></div>;

  const lessons = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({ ...lesson, module: module.title })),
  );
  const lesson = lessons[active];

  const complete = async () => {
    const progress = Math.round(((active + 1) / Math.max(lessons.length, 1)) * 100);
    setSaving(true);
    const response = await fetch(`/api/courses/${id}/progress`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress }),
    });

    if (response.ok) {
      setCourse({ ...course, enrollment: { progress } });
    } else {
      setError("Impossible d&apos;enregistrer votre progression.");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between gap-4 items-center">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => router.push(`/courses/${id}`)}
          >
            <ChevronLeft className="w-4 h-4 inline mr-1" />
            Quitter
          </Button>
          <p className="font-semibold truncate">{course.title}</p>
          <span className="text-sm text-emerald-300">{Math.round(course.enrollment?.progress ?? 0)}%</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 grid lg:grid-cols-[1fr_320px] gap-6">
        <section>
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-blue-800 to-violet-900 grid place-items-center shadow-2xl">
            <div className="text-center">
              <PlayCircle className="w-16 h-16 mx-auto text-white/90" />
              <p className="mt-4 text-lg font-semibold">{lesson?.title || "Leçon à venir"}</p>
              <p className="text-blue-100 mt-1">Espace d&apos;apprentissage interactif</p>
            </div>
          </div>

          <Card className="mt-6">
            <p className="text-sm text-blue-600 font-semibold">{lesson?.module}</p>
            <h1 className="text-2xl font-bold mt-1">{lesson?.title || "Aucune leçon disponible"}</h1>
            <p className="text-gray-600 mt-3">
              Prenez des notes, avancez à votre rythme et marquez cette leçon comme terminée quand vous êtes prêt.
            </p>

            <div className="flex justify-between mt-6">
              <Button variant="secondary" disabled={active === 0} onClick={() => setActive(active - 1)}>
                <ChevronLeft className="w-4 h-4 inline" /> Précédent
              </Button>

              <Button
                isLoading={saving}
                disabled={!lesson}
                onClick={async () => {
                  await complete();
                  if (active < lessons.length - 1) setActive(active + 1);
                }}
              >
                Terminer <ChevronRight className="w-4 h-4 inline" />
              </Button>
            </div>
          </Card>
        </section>

        <aside>
          <Card>
            <h2 className="font-bold mb-4">Contenu du cours</h2>
            <div className="space-y-4">
              {course.modules.map((module) => (
                <div key={module.id}>
                  <p className="text-xs font-bold text-slate-500 uppercase">{module.title}</p>
                  {module.lessons.map((item) => {
                    const index = lessons.findIndex((current) => current.id === item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActive(index)}
                        className={`w-full text-left mt-2 rounded-lg px-3 py-2 text-sm ${
                          index === active
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {index < Math.round((course.enrollment?.progress ?? 0) / 100 * lessons.length) && (
                          <CheckCircle2 className="w-4 h-4 inline mr-2 text-emerald-600" />
                        )}
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
