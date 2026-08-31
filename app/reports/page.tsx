"use client";

import Link from "next/link";
import { ArrowLeft, BarChart3, FileBarChart2, Percent, TrendingUp } from "lucide-react";
import { Button, Card } from "@/components/ui";

const metrics = [
  { label: "Taux de réussite", value: "92.4%", icon: Percent },
  { label: "Croissance", value: "+18.2%", icon: TrendingUp },
  { label: "Nombre de rapports", value: "124", icon: FileBarChart2 },
  { label: "Synthèse globale", value: "OK", icon: BarChart3 },
];

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <Button variant="secondary">Exporter les rapports</Button>
        </div>

        <header className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 p-8 text-white shadow-xl mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">Analyse</p>
              <h1 className="text-4xl font-black mt-2">Rapports & KPI</h1>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {metrics.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-3xl font-black mt-2">{value}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
