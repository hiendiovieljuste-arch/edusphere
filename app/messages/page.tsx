"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, MessageSquareText, SendHorizonal, Search } from "lucide-react";
import { Button } from "@/components/ui";

type MessageItem = { id: string; from: string; text: string; mine?: boolean; time: string };
type Conversation = { person: string; preview: string; unread: number; messages: MessageItem[] };

const initialConversations: Conversation[] = [
  {
    person: "M. Koffi",
    preview: "Le devoir est bien reçu, tu peux le compléter ce soir.",
    unread: 2,
    messages: [
      { id: "1", from: "M. Koffi", text: "Le devoir est bien reçu, tu peux le compléter ce soir.", time: "08:30" },
      { id: "2", from: "Moi", text: "Merci, je le termine avant 18h.", mine: true, time: "08:36" },
    ],
  },
  {
    person: "Lina",
    preview: "Peux-tu refaire le point sur le projet de groupe ?",
    unread: 1,
    messages: [
      { id: "3", from: "Lina", text: "Peux-tu refaire le point sur le projet de groupe ?", time: "Hier" },
    ],
  },
  {
    person: "Service admin",
    preview: "Votre bulletin a été publié.",
    unread: 0,
    messages: [
      { id: "4", from: "Service admin", text: "Votre bulletin a été publié.", time: "Aujourd'hui" },
    ],
  },
];

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const activeConversation = conversations[activeIndex];
  const currentUser = useMemo(() => session?.user?.name || "Moi", [session]);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) {
      setStatus("Écris un message avant d’envoyer.");
      return;
    }

    const newMessage: MessageItem = {
      id: crypto.randomUUID(),
      from: currentUser,
      text: trimmed,
      mine: true,
      time: "Maintenant",
    };

    const updatedConversations = conversations.map((conversation, index) => {
      if (index !== activeIndex) return conversation;
      return {
        ...conversation,
        preview: trimmed,
        unread: 0,
        messages: [...conversation.messages, newMessage],
      };
    });

    setConversations(updatedConversations);
    setMessage("");
    setStatus("Message envoyé.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <Button variant="secondary" className="gap-2"><Search className="w-4 h-4" /> Chercher</Button>
        </div>

        <header className="rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 p-8 text-white shadow-xl mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-100">Messagerie</p>
          <h1 className="text-4xl font-black mt-2">Messages & notifications</h1>
        </header>

        <div className="grid lg:grid-cols-[340px_1fr] gap-6">
          <div className="space-y-4">
            {conversations.map((conversation, index) => (
              <button
                key={conversation.person}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  activeIndex === index ? "border-cyan-500 bg-cyan-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 font-bold">
                      {conversation.person[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{conversation.person}</p>
                      <p className="text-sm text-slate-600 line-clamp-1">{conversation.preview}</p>
                    </div>
                  </div>
                  {conversation.unread > 0 && (
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-cyan-600 px-2 text-xs font-semibold text-white">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 font-bold">
                  {activeConversation.person[0]}
                </div>
                <div>
                  <p className="font-bold">{activeConversation.person}</p>
                  <p className="text-xs text-slate-500">En ligne</p>
                </div>
              </div>
              <button className="rounded-xl bg-cyan-100 p-2 text-cyan-700 hover:bg-cyan-200">
                <MessageSquareText className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 p-4 min-h-[360px] bg-slate-50">
              {activeConversation.messages.map((item) => (
                <div key={item.id} className={`flex ${item.mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${item.mine ? "bg-blue-600 text-white" : "bg-white text-slate-700 border border-slate-200"}`}>
                    <p className="text-sm">{item.text}</p>
                    <p className={`mt-2 text-[10px] ${item.mine ? "text-blue-100" : "text-slate-400"}`}>{item.from} • {item.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 p-4">
              <div className="flex gap-3">
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500"
                  placeholder="Écrivez votre message..."
                  onKeyDown={(event) => {
                    if (event.key === "Enter") sendMessage();
                  }}
                />
                <Button onClick={sendMessage} className="gap-2"><SendHorizonal className="w-4 h-4" /> Envoyer</Button>
              </div>
              {status && <p className="mt-3 text-sm text-slate-600">{status}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
