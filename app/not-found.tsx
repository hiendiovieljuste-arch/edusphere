"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h1 className="text-9xl md:text-10xl font-black text-white drop-shadow-lg">404</h1>
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Page non trouvée</h2>
        <p className="text-xl text-white/80 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg" className="gap-2">
              <Home className="w-5 h-5" />
              Retour à l&apos;accueil
            </Button>
          </Link>
          <Link href="/courses">
            <Button
              variant="ghost"
              size="lg"
              className="gap-2 bg-white text-blue-600 hover:bg-blue-50"
            >
              Explorer les cours
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="mt-16">
          <p className="text-white/60 text-sm">
            Besoin d&apos;aide ? <a href="/support" className="underline hover:text-white">Contactez le support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
