"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-8">
          <AlertTriangle className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-5xl font-black text-white mb-4">Oups!</h1>
        <p className="text-xl text-white/80 mb-2">Une erreur s&apos;est produite</p>
        <p className="text-white/60 mb-8 max-w-md">
          Nous regrettons cette interruption. Notre équipe a été notifiée et travaille à
          résoudre le problème.
        </p>

        {error.message && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-md mx-auto border border-white/20">
            <p className="text-sm text-white/80 font-mono">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            className="gap-2 bg-white text-red-600 hover:bg-gray-50"
            onClick={() => reset()}
          >
            <RotateCcw className="w-5 h-5" />
            Réessayer
          </Button>
          <Link href="/">
            <Button
              variant="ghost"
              size="lg"
              className="gap-2 bg-white/10 text-white hover:bg-white/20"
            >
              <Home className="w-5 h-5" />
              Retour à l&apos;accueil
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
