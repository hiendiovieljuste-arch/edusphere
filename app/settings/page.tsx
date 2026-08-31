"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { PageHeader } from "@/components/edusphere";
import { Bell, Lock, Eye, Download, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("notifications");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div>Chargement...</div>;
  if (!session) return null;

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Confidentialité", icon: Lock },
    { id: "display", label: "Affichage", icon: Eye },
    { id: "data", label: "Données", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title="Paramètres"
          description="Configurez votre compte et vos préférences"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-0 overflow-hidden">
              <div className="divide-y divide-gray-200">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === "notifications" && (
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Notifications</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email notifications</p>
                      <p className="text-sm text-gray-600">Recevoir des mises à jour par email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="border-t border-gray-200 pt-6 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Notifications push</p>
                      <p className="text-sm text-gray-600">Activer les notifications du navigateur</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>
                  <div className="border-t border-gray-200 pt-6 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Rappels de cours</p>
                      <p className="text-sm text-gray-600">Rappels pour les nouveaux cours</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "privacy" && (
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Confidentialité & Sécurité</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <Input type="password" placeholder="Entrez un nouveau mot de passe" />
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <Input type="password" placeholder="Confirmez le mot de passe" />
                  </div>
                  <Button variant="primary">Mettre à jour le mot de passe</Button>
                </div>
              </Card>
            )}

            {activeTab === "display" && (
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Affichage</h3>
                <div className="space-y-6">
                  <div>
                    <p className="font-medium text-gray-900 mb-3">Thème</p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 border-2 border-blue-600 bg-blue-50 text-blue-600 rounded-lg font-medium">
                        Clair
                      </button>
                      <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400">
                        Sombre
                      </button>
                      <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400">
                        Auto
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "data" && (
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Gestion des données</h3>
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                    <p className="text-sm text-blue-800">
                      Téléchargez toutes vos données ou supprimez votre compte.
                    </p>
                  </div>
                  <Button variant="secondary" className="gap-2 w-full">
                    <Download className="w-4 h-4" />
                    Télécharger mes données
                  </Button>
                  <Button variant="danger" className="gap-2 w-full">
                    <Trash2 className="w-4 h-4" />
                    Supprimer mon compte
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
