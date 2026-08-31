import Link from "next/link";
import { ArrowLeft, BookOpenText, Download, Search, Star } from "lucide-react";
import { Button, Card } from "@/components/ui";

const resources = [
  { title: "Gestion de projet agile", tag: "PM", rating: 4.9 },
  { title: "Programmation Python", tag: "DEV", rating: 4.8 },
  { title: "Marketing digital", tag: "BUS", rating: 4.7 },
  { title: "Communication orale", tag: "LANG", rating: 4.9 },
];

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <Button variant="secondary" className="gap-2"><Search className="w-4 h-4" /> Rechercher</Button>
        </div>

        <header className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 text-white shadow-xl mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-amber-100">Bibliothèque</p>
          <h1 className="text-4xl font-black mt-2">Ressources pédagogiques</h1>
        </header>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {resources.map((resource) => (
            <Card key={resource.title} className="p-4">
              <div className="rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 p-4 mb-4 flex items-center justify-center">
                <BookOpenText className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">{resource.tag}</span>
                <span className="flex items-center gap-1 text-sm text-amber-600"><Star className="w-4 h-4 fill-current" /> {resource.rating}</span>
              </div>
              <h3 className="font-bold text-lg">{resource.title}</h3>
              <Button variant="secondary" className="w-full mt-4 gap-2"><Download className="w-4 h-4" /> Ouvrir</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
