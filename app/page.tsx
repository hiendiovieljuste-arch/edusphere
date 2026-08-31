"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { ArrowRight, Star, Users, BookOpen, Zap, CheckCircle } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (!session) {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      <nav className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduSphere
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/login">
              <Button variant="primary">Commencer</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <div className="inline-block">
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              🚀 La plateforme d&apos;apprentissage du futur
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
            Transformez votre{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              avenir éducatif
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Accédez à des cours mondiaux, des mentors expérimentés et une communauté de
            millions d&apos;apprenants. Commencez votre voyage d&apos;apprentissage dès maintenant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/login">
              <Button variant="primary" size="lg" className="gap-2">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="secondary" size="lg">
                Explorer les cours
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-12 border-t border-gray-200">
            <div>
              <p className="text-3xl font-bold text-gray-900">50K+</p>
              <p className="text-gray-600">Étudiants actifs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">1000+</p>
              <p className="text-gray-600">Cours disponibles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">4.9★</p>
              <p className="text-gray-600">Note moyenne</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          Pourquoi EduSphere ?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: "Cours de qualité",
              description: "Apprenez auprès des meilleurs instructeurs du monde",
            },
            {
              icon: Zap,
              title: "Apprentissage rapide",
              description: "Des leçons courtes et efficaces adaptées à votre rythme",
            },
            {
              icon: Users,
              title: "Communauté active",
              description: "Connectez-vous avec d&apos;autres apprenants et partagez vos connaissances",
            },
            {
              icon: Star,
              title: "Certificats reconnus",
              description: "Obtenez des certificats professionnels valorisés",
            },
            {
              icon: CheckCircle,
              title: "Support 24/7",
              description: "Une équipe toujours disponible pour vous aider",
            },
            {
              icon: Zap,
              title: "Mises à jour constantes",
              description: "Contenu toujours frais et adapté aux tendances actuelles",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <Icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-xl opacity-90 mb-8">
            Rejoignez des milliers d&apos;apprenants qui transforment leur vie grâce à EduSphere.
          </p>
          <Link href="/login">
            <Button
              variant="primary"
              size="lg"
              className="gap-2 bg-white text-blue-600 hover:bg-blue-50"
            >
              Créer mon compte gratuitement
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg" />
                <span className="font-bold">EduSphere</span>
              </div>
              <p className="text-gray-400">La plateforme d&apos;apprentissage du futur</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Cours</a></li>
                <li><a href="#" className="hover:text-white">Certificats</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Ressources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Communauté</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Conditions</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduSphere. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
