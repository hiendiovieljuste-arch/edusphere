"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Award, Bell, BookOpen, CalendarDays, ClipboardCheck, GraduationCap, LibraryBig, LogOut, MessageSquareText, Settings, TrendingUp, Users } from "lucide-react";
import { Button, LoadingSpinner } from "@/components/ui";
import { CourseCard, PageHeader, StatsGrid, ThemeToggle } from "@/components/edusphere";

type Course = { id: string; title: string; description: string | null; level: string; category: string; price: number; rating: number; teacher: { name: string; avatar: string | null }; reviews: number; enrollments: number; progress?: number };
type Dashboard = { courses: Course[]; notifications: { id: string; title: string; message: string; type: string; createdAt: string }[]; metrics: { courseCount: number; students: number; averageProgress: number; completedCourses: number } };

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated") {
      fetch("/api/dashboard")
        .then((response) => response.json())
        .then(setData);
    }
  }, [router, status]);

  if (status === "loading" || !data) {
    return (
      <div className="min-h-screen grid place-items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isTeacher = session?.user.role === "TEACHER" || session?.user.role === "ADMIN";

  const stats = [
    { icon: <BookOpen className="w-6 h-6" />, label: isTeacher ? "Mes cours" : "Cours suivis", value: data.metrics.courseCount },
    { icon: <Users className="w-6 h-6" />, label: isTeacher ? "Apprenants" : "Progression", value: isTeacher ? data.metrics.students : `${data.metrics.averageProgress}%` },
    { icon: <TrendingUp className="w-6 h-6" />, label: isTeacher ? "Cours actifs" : "Cours terminés", value: isTeacher ? data.metrics.courseCount : data.metrics.completedCourses },
    { icon: <Award className="w-6 h-6" />, label: "Certificats", value: data.metrics.completedCourses },
  ];

  const progressEntries = data.courses
    .filter((course) => typeof course.progress === "number")
    .map((course) => ({
      title: course.title,
      progress: Math.max(0, Math.min(100, course.progress ?? 0)),
    }));

  const quickLinks = [
    { label: "Notes", href: "/grades", icon: ClipboardCheck },
    { label: "Présence", href: "/attendance", icon: GraduationCap },
    { label: "Agenda", href: "/calendar", icon: CalendarDays },
    { label: "Bibliothèque", href: "/library", icon: LibraryBig },
    { label: "Messages", href: "/messages", icon: MessageSquareText },
    ...(isTeacher || session?.user.role === "ADMIN" ? [{ label: "Admin", href: "/admin", icon: Settings }] : []),
    ...(session?.user.role === "ADMIN" ? [
      { label: "Établissements", href: "/institutions", icon: GraduationCap },
      { label: "Filières", href: "/academics", icon: BookOpen },
      { label: "Classes", href: "/classes", icon: GraduationCap },
      { label: "Étudiants", href: "/students", icon: Users },
      { label: "Enseignants", href: "/teachers", icon: Users },
      { label: "Admissions", href: "/admissions", icon: ClipboardCheck },
      { label: "Finance", href: "/finance", icon: TrendingUp },
      { label: "Rapports", href: "/reports", icon: TrendingUp },
    ] : []),
  ];

  const maxProgress = progressEntries.length ? Math.max(...progressEntries.map((item) => item.progress), 100) : 100;

  const handleExport = () => {
    const rows = [
      ["Titre", "Catégorie", "Niveau", "Progression", "Inscriptions"],
      ...data.courses.map((course) => [
        course.title,
        course.category,
        course.level,
        String(course.progress ?? 0),
        String(course.enrollments),
      ]),
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dashboard-eduSphere.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-40 dark:border-slate-700 dark:bg-slate-900/90">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 font-black text-xl text-blue-700 dark:text-blue-400">
            <span className="w-9 h-9 grid place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white">E</span>
            EduSphere
          </button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>Profil</Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/settings")}><Settings className="w-4 h-4" /></Button>
            <Button variant="danger" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <PageHeader
          title={`Bienvenue, ${session?.user.name || "apprenant"} 👋`}
          description={isTeacher ? "Pilotez vos cours et votre communauté." : "Reprenez là où vous vous êtes arrêté."}
          action={
            <Button variant="secondary" size="sm" onClick={handleExport}>
              Exporter CSV
            </Button>
          }
        />
        <StatsGrid stats={stats} />

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold dark:text-slate-100">Accès rapide</h2>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
            {quickLinks.map(({ label, href, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => router.push(href)}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="mb-3 inline-flex rounded-xl bg-blue-100 p-2 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-lg font-bold dark:text-slate-100">{label}</p>
              </button>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold dark:text-slate-100">{isTeacher ? "Mes cours" : "Mes apprentissages"}</h2>
              <div className="flex gap-2">
                <Button onClick={() => router.push("/courses")}>{isTeacher ? "Gérer le catalogue" : "Explorer les cours"}</Button>
                {isTeacher && <Button variant="secondary" onClick={() => router.push("/courses/new")}>Nouveau cours</Button>}
              </div>
            </div>

            {data.courses.length ? (
              <div className="grid md:grid-cols-2 gap-6">
                {data.courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                    teacher={{ name: course.teacher.name, avatar: course.teacher.avatar || undefined }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-10 text-center shadow dark:bg-slate-800 dark:text-slate-100">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-slate-300">Aucun cours pour le moment.</p>
                <Button className="mt-4" onClick={() => router.push("/courses")}>Découvrir le catalogue</Button>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow dark:bg-slate-800 dark:text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2 items-center">
                  <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="font-bold">Notifications</h2>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-300">{data.notifications.length} actif{data.notifications.length > 1 ? "s" : ""}</span>
              </div>
              <div className="mt-4 space-y-3">
                {data.notifications.length ? (
                  data.notifications.map((notification) => (
                    <div key={notification.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                      <p className="font-semibold text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1 dark:text-slate-300">{notification.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-slate-300">Vous êtes à jour.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-800 dark:text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Analytique</h2>
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="space-y-4">
                {progressEntries.length ? (
                  progressEntries.slice(0, 4).map((item) => (
                    <div key={item.title}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="truncate mr-2">{item.title}</span>
                        <span className="font-semibold">{item.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                          style={{ width: `${(item.progress / maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-slate-300">Aucune donnée de progression pour le moment.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl p-6 text-white bg-gradient-to-br from-orange-400 to-rose-500">
              <p className="font-bold text-lg">Votre prochaine étape</p>
              <p className="text-sm mt-2 text-white/90">Terminez une leçon aujourd’hui pour faire avancer votre parcours.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
