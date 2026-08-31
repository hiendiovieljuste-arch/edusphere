"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarCheck2, Clock3, UserCheck } from "lucide-react";
import { Button, Card, LoadingSpinner } from "@/components/ui";

type AttendanceStat = { label: string; value: string; helper?: string };
type AttendanceDay = { day: string; status: string };

export default function AttendancePage() {
  const [stats, setStats] = useState<AttendanceStat[]>([]);
  const [days, setDays] = useState<AttendanceDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attendance")
      .then((response) => response.json())
      .then((payload) => {
        setStats(payload.stats ?? []);
        setDays(payload.days ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <Button variant="secondary">Télécharger</Button>
        </div>

        <header className="rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8 text-white shadow-xl mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-violet-100">Vie scolaire</p>
          <h1 className="text-4xl font-black mt-2">Présence & ponctualité</h1>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value }, index) => {
            const Icon = [UserCheck, Clock3, CalendarCheck2][index % 3];
            return (
              <Card key={label} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                  </div>
                  <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card>
          <h2 className="text-2xl font-bold mb-6">Semaine actuelle</h2>
          <div className="grid md:grid-cols-5 gap-3">
            {days.map(({ day, status }) => (
              <div key={day} className="rounded-2xl border border-slate-200 p-4 text-center">
                <p className="font-semibold">{day}</p>
                <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status === "Présent" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {status}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
