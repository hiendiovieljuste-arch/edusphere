"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Building2,
  CalendarRange,
  CreditCard,
  FileText,
  GraduationCap,
  Shield,
  Users,
  Wallet,
} from "lucide-react";
import { Button, Card } from "@/components/ui";

const cards = [
  { title: "Établissements", value: "148", detail: "structures actives", icon: Building2 },
  { title: "Classes", value: "642", detail: "groupes en cours", icon: GraduationCap },
  { title: "Étudiants", value: "24.8K", detail: "utilisateurs connectés", icon: Users },
  { title: "Sécurité", value: "99.98%", detail: "taux de conformité", icon: Shield },
];

const modules = [
  "Gestion des établissements",
  "Promotions et filières",
  "Cohortes et classes",
  "Admission et inscription",
  "Suivi des présences",
  "Devoirs et évaluations",
  "Paiements et frais",
  "RH & personnels",
  "Comptes et permissions",
  "Reporting global",
];

const institutionRows = [
  { name: "Université de Paris", type: "Université", campuses: 4, students: "12.4K", status: "Actif" },
  { name: "Institut Saint-Jean", type: "Institut", campuses: 2, students: "4.8K", status: "Actif" },
  { name: "Campus Lyon Tech", type: "Grande école", campuses: 3, students: "8.1K", status: "Migration" },
  { name: "École Centrale Dakar", type: "École", campuses: 1, students: "2.3K", status: "Actif" },
];

const analytics = [
  { label: "Taux de réussite", value: "92.4%", detail: "+3.1% vs mois dernier" },
  { label: "Présence moyenne", value: "97.1%", detail: "dans toutes les classes" },
  { label: "Paiements reçus", value: "€1.62M", detail: "séries trimestrielles" },
  { label: "Demandes en attente", value: "312", detail: "tout type d’admission" },
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div className="min-h-screen grid place-items-center text-slate-500">Chargement…</div>;
  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  const isAdmin = session?.user?.role === "ADMIN";
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-xl text-center">
          <h1 className="text-3xl font-black text-slate-900">Accès refusé</h1>
          <p className="mt-3 text-slate-600">Cette zone est réservée à l’administration.</p>
          <Link href="/dashboard" className="inline-block mt-6">
            <Button>Retour au dashboard</Button>
          </Link>
        </Card>
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
          <Button variant="secondary">Exporter rapport</Button>
        </div>

        <header className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 p-8 text-white shadow-2xl mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-violet-200">Console admin</p>
          <h1 className="text-4xl font-black mt-2">Système éducatif complet</h1>
          <p className="mt-2 text-violet-100">Pilotage global des établissements, classes, filières, promotions, étudiants, personnels, finances et reporting.</p>
        </header>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {cards.map(({ title, value, detail, icon: Icon }) => (
            <Card key={title} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{title}</p>
                  <p className="text-3xl font-black mt-2">{value}</p>
                  <p className="text-xs text-slate-500 mt-1">{detail}</p>
                </div>
                <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-violet-600" />
              <h2 className="text-2xl font-bold">Modules de gestion</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {modules.map((module) => (
                <div key={module} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {module}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <CalendarRange className="w-6 h-6 text-violet-600" />
              <h2 className="text-2xl font-bold">Récapitulatif</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li>• 312 demandes d’inscription en attente</li>
              <li>• 18 nouveaux événements à valider</li>
              <li>• 7 établissements en cours d’intégration</li>
              <li>• 94 retards de présence signalés</li>
              <li>• 3 incidents de sécurité réseau</li>
            </ul>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {analytics.map((item) => (
            <Card key={item.label} className="p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="text-3xl font-black mt-3">{item.value}</p>
              <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold">Établissements du réseau</h2>
            <Button variant="secondary">Ajouter un établissement</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 border-b">
                  <th className="py-3 pr-4">Nom</th>
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4">Campus</th>
                  <th className="py-3 pr-4">Étudiants</th>
                  <th className="py-3 pr-4">Statut</th>
                </tr>
              </thead>
              <tbody>
                {institutionRows.map((row) => (
                  <tr key={row.name} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-semibold">{row.name}</td>
                    <td className="py-3 pr-4">{row.type}</td>
                    <td className="py-3 pr-4">{row.campuses}</td>
                    <td className="py-3 pr-4">{row.students}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-1 text-xs font-semibold">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-lg">Établissements</h3>
            </div>
            <p className="text-sm text-slate-600">Gérez plusieurs campus, succursales et centres de formation avec des paramètres indépendants.</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-lg">Rôles & permissions</h3>
            </div>
            <p className="text-sm text-slate-600">Chaque utilisateur voit uniquement les données autorisées selon sa structure, promotion et rôle.</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Wallet className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-lg">Finance & budget</h3>
            </div>
            <p className="text-sm text-slate-600">Suivez les dépenses, les paiements, les bourses et les budgets de chaque établissement.</p>
          </Card>
        </div>

        <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold">Filières</h3>
            </div>
            <p className="text-2xl font-black">26</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold">Promotions</h3>
            </div>
            <p className="text-2xl font-black">89</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold">Départements</h3>
            </div>
            <p className="text-2xl font-black">47</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold">Paiements</h3>
            </div>
            <p className="text-2xl font-black">94%</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
