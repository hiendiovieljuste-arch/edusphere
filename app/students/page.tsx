"use client";

import Link from "next/link";
import { ArrowLeft, GraduationCap, Mail, Phone, UserRound } from "lucide-react";
import { Button, Card } from "@/components/ui";

const students = [
  { name: "Jean Moreau", email: "jean.moreau@edusphere.fr", phone: "+33 6 12 34 56 78", className: "INFO-IA-1", average: "88%", status: "Actif" },
  { name: "Alice Bernard", email: "alice.bernard@edusphere.fr", phone: "+33 6 11 22 33 44", className: "INFO-IA-1", average: "91%", status: "Actif" },
  { name: "Noah Martin", email: "noah.martin@edusphere.fr", phone: "+33 6 18 44 66 77", className: "DS-2026", average: "85%", status: "En retard" },
  { name: "Emma Leroy", email: "emma.leroy@edusphere.fr", phone: "+33 6 41 87 15 22", className: "MKT-2A", average: "93%", status: "Actif" },
];

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <Button variant="secondary">Ajouter un étudiant</Button>
        </div>

        <header className="rounded-3xl bg-gradient-to-r from-cyan-700 via-sky-700 to-blue-700 p-8 text-white shadow-xl mb-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-100">Étudiants</p>
              <h1 className="text-4xl font-black mt-2">Gestion des apprenants</h1>
            </div>
          </div>
        </header>

        <div className="grid gap-4">
          {students.map((student) => (
            <Card key={student.email} className="p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
                    <UserRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">{student.name}</h2>
                    <p className="text-sm text-slate-600">{student.className}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4" /> {student.email}</span>
                  <span className="inline-flex items-center gap-2"><Phone className="w-4 h-4" /> {student.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">Moyenne {student.average}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">{student.status}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
