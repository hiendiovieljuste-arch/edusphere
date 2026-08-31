"use client";

import Link from "next/link";
import { ArrowLeft, Building2, MapPin, School, Users } from "lucide-react";
import { Button, Card } from "@/components/ui";

const institutions = [
  { name: "Université de Paris", type: "Université", country: "France", programs: 12, students: "12.4K", status: "Actif" },
  { name: "Institut Saint-Jean", type: "Institut", country: "France", programs: 7, students: "4.8K", status: "Actif" },
  { name: "Campus Lyon Tech", type: "Grande école", country: "France", programs: 9, students: "8.1K", status: "Migration" },
  { name: "École Centrale Dakar", type: "École", country: "Sénégal", programs: 5, students: "2.3K", status: "Actif" },
];

export default function InstitutionsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <Button variant="secondary">Nouvel établissement</Button>
        </div>

        <header className="rounded-3xl bg-gradient-to-r from-sky-700 via-indigo-700 to-violet-700 p-8 text-white shadow-xl mb-8">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-100">Réseau</p>
              <h1 className="text-4xl font-black mt-2">Établissements</h1>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {institutions.map((institution) => (
            <Card key={institution.name} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                  <School className="w-5 h-5" />
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">
                  {institution.status}
                </span>
              </div>
              <h2 className="text-xl font-black">{institution.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{institution.type}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {institution.country}</p>
                <p className="flex items-center gap-2"><Users className="w-4 h-4" /> {institution.students} étudiants</p>
                <p className="flex items-center gap-2"><Building2 className="w-4 h-4" /> {institution.programs} programmes</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
