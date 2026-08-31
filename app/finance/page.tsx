"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CircleDollarSign, CreditCard, TrendingUp, Wallet } from "lucide-react";
import { Button, Card, LoadingSpinner } from "@/components/ui";

type FinanceItem = { label: string; value: string; trend: string };
type BudgetRow = { category: string; amount: string; due: string };

export default function FinancePage() {
  const [summary, setSummary] = useState<FinanceItem[]>([]);
  const [rows, setRows] = useState<BudgetRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/finance")
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
          <Button variant="secondary">Exécuter le reporting</Button>
        </div>

        <header className="rounded-3xl bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 p-8 text-white shadow-xl mb-8">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8" />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">Finance</p>
              <h1 className="text-4xl font-black mt-2">Finances & budgets</h1>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {summary.map(({ label, value, trend }) => (
            <Card key={label} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  {label.includes("Paiements") ? <CreditCard className="w-5 h-5" /> : label.includes("Budget") ? <CircleDollarSign className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                </div>
                <span className="text-xs font-bold text-emerald-700">{trend}</span>
              </div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-3xl font-black mt-2">{value}</p>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Réalisation</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.category} className="border-t border-slate-200">
                    <td className="px-4 py-4 font-semibold">{row.category}</td>
                    <td className="px-4 py-4">{row.amount}</td>
                    <td className="px-4 py-4"><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">{row.due}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
