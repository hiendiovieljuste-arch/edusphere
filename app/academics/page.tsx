"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, Layers3 } from "lucide-react";
import { Button, Card } from "@/components/ui";

const programs = [
  { name: "Informatique", code: "INFO", promotions: 4, students: "4.2K", level: "Licence" },
  { name: "Marketing Digital", code: "MKT", promotions: 3, students: "2.1K", level: "Bachelor" },
  { name: "Data Science", code: "DS", promotions: 2, students: "1.8K", level: "Master" },
  { name: "Commerce International", code: "COM", promotions: 5, students: "3.3K", level: "Licence" },
];

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <Button variant="secondary">Créer une filière</Button>
        </div>

        <header className="rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 p-8 text-white shadow-xl mb-8">
          <div className="flex items-center gap-3">
            <Layers3 className="w-8 h-8" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-violet-100">Académie</p>
              <h1 className="text-4xl font-black mt-2">Filières & promotions</h1>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {programs.map((program) => (
            <Card key={program.name} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase text-slate-500">{program.code}</span>
              </div>
              <h2 className="text-xl font-black">{program.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{program.level}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> {program.promotions} promotions</p>
                <p className="flex items-center gap-2"><Layers3 className="w-4 h-4" /> {program.students} étudiants</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
