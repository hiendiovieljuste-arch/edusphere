"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock, GraduationCap, Users } from "lucide-react";
import { Button, Card } from "@/components/ui";

const classes = [
  { name: "INFO-IA-1", promotion: "Promotion 2026", mentor: "Sarah Dupont", students: 35, schedule: "Lundi / Mercredi / Vendredi" },
  { name: "DS-2026", promotion: "Promotion 2026", mentor: "Martin Leclerc", students: 28, schedule: "Mardi / Jeudi" },
  { name: "MKT-2A", promotion: "Promotion 2025", mentor: "Claire Morel", students: 31, schedule: "Lundi / Jeudi" },
  { name: "COM-B3", promotion: "Promotion 2024", mentor: "Yann Dubois", students: 26, schedule: "Mercredi / Samedi" },
];

export default function ClassesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <Button variant="secondary">Nouvelle classe</Button>
        </div>

        <header className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-700 p-8 text-white shadow-xl mb-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Classes</p>
              <h1 className="text-4xl font-black mt-2">Promotions & classes</h1>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          {classes.map((klass) => (
            <Card key={klass.name} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{klass.name}</span>
              </div>
              <h2 className="text-xl font-black">{klass.promotion}</h2>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2"><Users className="w-4 h-4" /> {klass.students} élèves</p>
                <p className="flex items-center gap-2"><CalendarClock className="w-4 h-4" /> {klass.schedule}</p>
                <p className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Encadrant : {klass.mentor}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
