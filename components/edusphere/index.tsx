"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, Users, FileText, MoonStar, SunMedium } from "lucide-react";
import { Card, Badge } from "@/components/ui";

interface CourseCardProps {
  id: string;
  title: string;
  description?: string | null;
  image?: string;
  level: string;
  category: string;
  teacher: { name: string; avatar?: string | null };
  rating: number;
  reviews: number;
  enrollments: number;
  price?: number;
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("edusphere-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = savedTheme ? savedTheme === "dark" : prefersDark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("edusphere-theme", next ? "dark" : "light");
  };

  if (!mounted) return <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      {dark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </button>
  );
}

export function CourseCard({
  id,
  title,
  description,
  image,
  level,
  category,
  teacher,
  rating,
  reviews,
  enrollments,
  price,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <Card hover className="cursor-pointer group overflow-hidden h-full dark:bg-slate-800 dark:border-slate-700">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 h-40 rounded-lg mb-4">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-white opacity-50" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 dark:text-slate-100">
              {title}
            </h3>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 dark:text-slate-300">{description}</p>

          <div className="flex items-center justify-between">
            <Badge variant="primary" size="sm">
              {level}
            </Badge>
            <Badge variant="success" size="sm">
              {category}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <img
              src={teacher.avatar || "https://via.placeholder.com/32"}
              alt={teacher.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-gray-700 font-medium dark:text-slate-200">{teacher.name}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900 dark:text-slate-100">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500 dark:text-slate-400">({reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 text-sm dark:text-slate-300">
              <Users className="w-4 h-4" />
              <span>{enrollments}</span>
            </div>
          </div>

          {price !== undefined && (
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {price === 0 ? "Gratuit" : `${price}€`}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

interface HeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: HeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-6 rounded-xl mb-8 shadow-lg shadow-blue-500/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          {description && <p className="text-blue-100">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
}

export function StatCard({ icon, label, value, change }: StatCardProps) {
  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium dark:text-slate-300">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 dark:text-slate-100">{value}</p>
          {change !== undefined && (
            <p className={`text-sm font-semibold mt-1 ${change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {change >= 0 ? "+" : ""}{change}%
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-100 rounded-lg text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{icon}</div>
      </div>
    </Card>
  );
}

interface StatsGridProps {
  stats: StatCardProps[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
