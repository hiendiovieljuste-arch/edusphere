"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, MapPin } from "lucide-react";
import { Button, Card } from "@/components/ui";

type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "cours" | "événement" | "examen" | "réunion";
};

const initialEvents: EventItem[] = [
  { id: "e1", title: "Rentrée des classes", date: "2026-09-12", time: "08:30", location: "Amphithéâtre A", type: "cours" },
  { id: "e2", title: "Sprint final de projet", date: "2026-09-18", time: "14:00", location: "Salle 12", type: "événement" },
  { id: "e3", title: "Forum carrière", date: "2026-09-25", time: "10:00", location: "Hall principal", type: "réunion" },
  { id: "e4", title: "Concours interne", date: "2026-10-02", time: "09:00", location: "Campus Nord", type: "examen" },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [form, setForm] = useState({ title: "", date: "", time: "", location: "", type: "événement" as EventItem["type"] });
  const [status, setStatus] = useState("");

  const handleCreateEvent = () => {
    if (!form.title.trim() || !form.date || !form.time || !form.location.trim()) {
      setStatus("Remplis tous les champs pour créer un événement.");
      return;
    }

    const newEvent: EventItem = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      type: form.type,
    };

    setEvents((current) => [newEvent, ...current]);
    setForm({ title: "", date: "", time: "", location: "", type: "événement" });
    setStatus("Événement ajouté avec succès.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <Button variant="secondary">Ajouter un événement</Button>
        </div>

        <header className="rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 p-8 text-white shadow-xl mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-100">Agenda</p>
          <h1 className="text-4xl font-black mt-2">Calendrier scolaire</h1>
        </header>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <CalendarDays className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-bold">Événements à venir</h2>
            </div>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex gap-4 rounded-2xl border border-slate-200 p-4">
                  <div className="w-20 rounded-xl bg-sky-100 p-3 text-center text-sky-700 font-bold">
                    {new Date(event.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }).replace(".", "")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase font-semibold text-slate-600">{event.type}</span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-slate-600">
                      <p className="flex items-center gap-2"><Clock3 className="w-4 h-4" /> {event.time}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold mb-4">Créer un événement</h2>
            <div className="space-y-4">
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                placeholder="Titre de l’événement"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm({ ...form, date: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                />
                <input
                  type="time"
                  value={form.time}
                  onChange={(event) => setForm({ ...form, time: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                />
              </div>

              <input
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
                placeholder="Lieu"
              />

              <select
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value as EventItem["type"] })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-500"
              >
                <option value="cours">Cours</option>
                <option value="événement">Événement</option>
                <option value="examen">Examen</option>
                <option value="réunion">Réunion</option>
              </select>

              <Button onClick={handleCreateEvent} className="w-full">Ajouter</Button>
              {status && <p className="text-sm text-slate-600">{status}</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
