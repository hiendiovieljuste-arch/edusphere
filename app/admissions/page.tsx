"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, School, UserPlus } from "lucide-react";
import { Button, Card, LoadingSpinner } from "@/components/ui";

type AdmissionRow = {
  name: string;
  email: string;
  program: string;
  status: string;
  score: number;
  className: string;
};

type SummaryItem = {
  label: string;
  value: string;
  helper: string;
};

export default function AdmissionsPage() {
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [rows, setRows] = useState<AdmissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admissions")
      .then((res) => res.json())
      .then((payload) => {
        setSummary(payload.summary ?? []);
        setRows(payload.rows ?? []);
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
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <Button variant="secondary">Valider les dossiers</Button>
        </div>

        <header className="rounded-3xl bg-gradient-to-r from-pink-700 via-rose-700 to-orange-700 p-8 text-white shadow-xl mb-8">
          <div className="flex items-center gap-3">
            <UserPlus className="w-8 h-8" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-pink-100">Admissions</p>
              <h1 className="text-4xl font-black mt-2">Candidatures & dossiers</h1>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {summary.map(({ label, value, helper }) => (
            <Card key={label} className="p-4">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-3xl font-black mt-2">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{helper}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-4">
          {rows.map((candidate) => (
            <Card key={candidate.email} className="p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-pink-100 p-3 text-pink-700">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">{candidate.name}</h2>
                    <p className="text-sm text-slate-600">{candidate.program} • {candidate.className}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">Score {candidate.score}%</span>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${candidate.status === "Accepté" ? "bg-emerald-100 text-emerald-700" : candidate.status === "En attente" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"}`}>
                    {candidate.status}
                  </span>
                </div>

                <Button variant="secondary" size="sm">Voir dossier</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
