"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Mail, School, UserCog } from "lucide-react";
import { Button, Card } from "@/components/ui";

const teachers = [
  { name: "Sarah Dupont", email: "sarah.dupont@edusphere.fr", department: "Développement web", courses: 4, students: 142, status: "Présente" },
  { name: "Martin Leclerc", email: "martin.leclerc@edusphere.fr", department: "Data science", courses: 3, students: 118, status: "Présent" },
  { name: "Claire Morel", email: "claire.morel@edusphere.fr", department: "Marketing", courses: 2, students: 87, status: "Présente" },
  { name: "Yann Dubois", email: "yann.dubois@edusphere.fr", department: "Finance", courses: 3, students: 100, status: "En congé" },
];

export default function TeachersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <Button variant="secondary">Ajouter un enseignant</Button>
        </div>

        <header className="rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-8 text-white shadow-xl mb-8">
          <div className="flex items-center gap-3">
            <UserCog className="w-8 h-8" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-amber-100">Personnel</p>
              <h1 className="text-4xl font-black mt-2">Enseignants & responsables</h1>
            </div>
          </div>
        </header>

        <div className="grid gap-4">
          {teachers.map((teacher) => (
            <Card key={teacher.email} className="p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">{teacher.name}</h2>
                    <p className="text-sm text-slate-600">{teacher.department}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4" /> {teacher.email}</span>
                  <span className="inline-flex items-center gap-2"><BookOpen className="w-4 h-4" /> {teacher.courses} cours</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{teacher.students} élèves</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">{teacher.status}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
