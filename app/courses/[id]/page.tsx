"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Award, CheckCircle2, Clock, Play, Star, Users } from "lucide-react";
import { Badge, Button, Card, LoadingSpinner } from "@/components/ui";

type Course = {
  id: string;
  title: string;
  description: string | null;
  level: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  enrollments: number;
  enrollment: { progress: number; status: string } | null;
  teacher: { name: string; bio: string | null };
  modules: {
    id: string;
    title: string;
    lessons: { id: string; title: string; duration: number | null }[];
  }[];
};

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useSession();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status !== "authenticated") return;

    fetch(`/api/courses/${id}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Ce cours est indisponible.");
        return response.json();
      })
      .then((data: Course) => setCourse(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, router, status]);

  const enroll = async () => {
    setEnrolling(true);
    setError("");

    const response = await fetch(`/api/courses/${id}/enroll`, { method: "POST" });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "L&apos;inscription a échoué.");
    } else {
      setCourse((current) => {
        if (!current) return current;
        return {
          ...current,
          enrollment: { progress: 0, status: "ACTIVE" },
          enrollments: current.enrollments + 1,
        };
      });
    }

    setEnrolling(false);
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen grid place-items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <p className="text-red-600 mb-4">{error || "Cours introuvable"}</p>
        <Button onClick={() => router.push("/courses")}>Retour au catalogue</Button>
      </div>
    );
  }

  const lessons = course.modules.flatMap((module) => module.lessons);
  const duration = lessons.reduce((sum, lesson) => sum + (lesson.duration ?? 0), 0);
  const enrolled = Boolean(course.enrollment);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-10 lg:grid-cols-[1.3fr_.7fr] items-center">
          <div>
            <div className="flex gap-2 mb-5">
              <Badge variant="success">{course.category}</Badge>
              <Badge variant="primary">{course.level}</Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight">{course.title}</h1>
            <p className="text-lg md:text-xl text-blue-100 mt-5 max-w-2xl">
              {course.description || "Une formation conçue pour progresser à votre rythme."}
            </p>

            <div className="flex flex-wrap items-center gap-5 mt-7 text-sm">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                {course.rating.toFixed(1)} ({course.reviewCount} avis)
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.enrollments} apprenants
              </span>
            </div>

            <div className="mt-8">
              {enrolled ? (
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                  onClick={() => router.push(`/courses/${course.id}/learn`)}
                >
                  <Play className="w-5 h-5" />
                  {course.enrollment?.progress ? "Reprendre le cours" : "Commencer le cours"}
                </Button>
              ) : (
                <Button
                  size="lg"
                  isLoading={enrolling}
                  className="gap-2 bg-white text-blue-700 hover:bg-blue-50"
                  onClick={enroll}
                >
                  <Play className="w-5 h-5" />
                  S&apos;inscrire {course.price === 0 ? "gratuitement" : `— ${course.price.toFixed(2)} €`}
                </Button>
              )}
              {error && <p className="mt-3 text-sm text-red-100">{error}</p>}
            </div>
          </div>

          <Card className="bg-white/10 border border-white/20 shadow-2xl text-white">
            <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">Votre parcours</p>
            <p className="text-3xl font-bold mt-3">{course.modules.length} modules · {lessons.length} leçons</p>

            <div className="mt-6 flex items-center gap-3">
              <Clock className="w-5 h-5" />
              <span>{duration ? `${duration} minutes de contenu` : "Contenu en préparation"}</span>
            </div>

            {enrolled && (
              <div className="mt-7">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression</span>
                  <span>{Math.round(course.enrollment?.progress ?? 0)}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400"
                    style={{ width: `${course.enrollment?.progress ?? 0}%` }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <h2 className="text-2xl font-bold mb-4">À propos du cours</h2>
            <p className="text-gray-600 leading-7">
              {course.description || "Les objectifs de ce cours seront ajoutés prochainement."}
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold mb-5">Programme</h2>
            <div className="space-y-3">
              {course.modules.length ? (
                course.modules.map((module, index) => (
                  <div key={module.id} className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 p-4 font-semibold">
                      Module {index + 1} · {module.title}
                    </div>
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex justify-between gap-4 p-4 border-t border-slate-100 text-sm">
                        <span className="flex gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          {lesson.title}
                        </span>
                        <span className="text-slate-500">
                          {lesson.duration ? `${lesson.duration} min` : "À votre rythme"}
                        </span>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Le programme détaillé arrive bientôt.</p>
              )}
            </div>
          </Card>
        </div>

        <aside>
          <Card>
            <h2 className="font-bold text-lg mb-4">Votre instructeur</h2>
            <p className="font-semibold">{course.teacher.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              {course.teacher.bio || "Instructeur EduSphere"}
            </p>
            <div className="mt-6 pt-5 border-t text-sm text-gray-600 flex gap-2 items-center">
              <Award className="w-4 h-4 text-emerald-600" />
              Certificat de fin de parcours inclus
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
