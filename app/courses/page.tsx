"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, LoadingSpinner } from "@/components/ui";
import { CourseCard, PageHeader } from "@/components/edusphere";

interface Course {
  id: string;
  title: string;
  description?: string;
  image?: string;
  level: string;
  category: string;
  teacher: { name: string; avatar?: string };
  rating: number;
  reviews: number;
  enrollments: number;
}

export default function CoursesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const canCreateCourse = session?.user?.role === "TEACHER" || session?.user?.role === "ADMIN";

  useEffect(() => {
    // Fetch courses from API
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error("Impossible de charger le catalogue");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = selectedLevel === "ALL" || course.level === selectedLevel;
    const matchesCategory = selectedCategory === "ALL" || course.category === selectedCategory;

    return matchesSearch && matchesLevel && matchesCategory;
  });

  const levels = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];
  const categories = ["ALL", "TECH", "BUSINESS", "LANGUAGE", "ART"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title="Découvrez nos cours"
          description="Explorez notre catalogue complet de formations professionnelles"
          action={
            canCreateCourse ? (
              <Button onClick={() => router.push("/courses/new")} className="gap-2">
                <Plus className="w-4 h-4" />
                Créer un cours
              </Button>
            ) : undefined
          }
        />

        {/* Search & Filters */}
        <div className="mb-8 space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                icon={<Search className="w-5 h-5" />}
                placeholder="Rechercher un cours..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="secondary" className="gap-2">
              <Filter className="w-5 h-5" />
              Filtres
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level === "ALL" ? "Tous les niveaux" : level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "ALL" ? "Toutes les catégories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun cours ne correspond à votre recherche</p>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600 font-medium">
                {filteredCourses.length} cours trouvé{filteredCourses.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  enrollments={course.enrollments}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
