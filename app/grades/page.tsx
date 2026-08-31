"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, BarChart3, CheckCircle2, ClipboardList, TrendingUp } from "lucide-react";
import { Button, Card, LoadingSpinner } from "@/components/ui";

type GradeRow = {
  matiere?: string;
  note?: number;
  coeff?: number;
  moyenne?: number;
  student?: string;
  email?: string;
  className?: string;
  score?: number;
  average?: number;
  status?: string;
};

export default function GradesPage() {
  const { status } = useSession();
  const [rows, setRows] = useState<GradeRow[]>([]);
  const [overview, setOverview] = useState<Array<{ label: string; value: string }>>([]);
  const [mode, setMode] = useState<"student" | "management">("student");

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/grades")
      .then((response) => response.json())
      .then((payload) => {
        setMode(payload.mode);
        setOverview(payload.overview ?? []);
        setRows(payload.rows ?? []);
      })
      .catch(() => {
        setRows([]);
        setOverview([]);
      });
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen grid place-items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isManagement = mode === "management";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          </div>
          <Button variant="secondary">Exporter</Button>
        </div>

        <header className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white shadow-xl mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">Suivi académique</p>
          <h1 className="text-4xl font-black mt-2">{isManagement ? "Suivi des notes" : "Mes notes"}</h1>
          <p className="mt-2 text-emerald-50">
            {isManagement ? "Supervision globale des moyennes et résultats de la promotion." : "Suivez vos résultats, votre progression et votre classement."}
          </p>
        </header>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {overview.map(({ label, value }) => (
            <Card key={label} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  {label.includes("Moyenne") ? <TrendingUp className="w-5 h-5" /> : label.includes("Devoir") ? <CheckCircle2 className="w-5 h-5" /> : label.includes("Rang") ? <BarChart3 className="w-5 h-5" /> : <ClipboardList className="w-5 h-5" />}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  {isManagement ? (
                    <>
                      <th className="px-4 py-3">Étudiant</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Classe</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Moyenne</th>
                      <th className="px-4 py-3">Statut</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3">Matière</th>
                      <th className="px-4 py-3">Note</th>
                      <th className="px-4 py-3">Coefficient</th>
                      <th className="px-4 py-3">Moyenne classe</th>
                      <th className="px-4 py-3">Évolution</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  isManagement ? (
                    <tr key={`${row.student ?? "student"}-${index}`} className="border-t border-slate-200">
                      <td className="px-4 py-4 font-semibold">{row.student}</td>
                      <td className="px-4 py-4">{row.email}</td>
                      <td className="px-4 py-4">{row.className}</td>
                      <td className="px-4 py-4">{row.score}%</td>
                      <td className="px-4 py-4">{row.average}%</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${row.status === "Correct" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ) : (
                    <tr key={row.matiere ?? `subject-${index}`} className="border-t border-slate-200">
                      <td className="px-4 py-4 font-semibold">{row.matiere}</td>
                      <td className="px-4 py-4">{row.note}/20</td>
                      <td className="px-4 py-4">{row.coeff}</td>
                      <td className="px-4 py-4">{row.moyenne}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                          +{Math.max(1, Math.round(((row.note ?? 0) - (row.moyenne ?? 0)) * 2))} pts
                        </span>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
