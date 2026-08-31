"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenue, {session.user?.name} 👋
        </h1>
        <p className="text-gray-600 mt-2">Rôle : {session.user?.role}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-xl">📚 Cours</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-xl">✅ Devoirs</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">8/12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-xl">🏆 Points</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">245</p>
          </div>
        </div>
      </div>
    </div>
  );
}
