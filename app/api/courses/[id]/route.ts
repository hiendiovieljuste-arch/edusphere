import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      teacher: { select: { id: true, name: true, bio: true, avatar: true, institutionId: true } },
      modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } },
      reviews: { orderBy: { createdAt: "desc" }, take: 5 },
      _count: { select: { enrollments: true, reviews: true } },
      enrollments: { where: { userId: session.user.id }, select: { progress: true, status: true } },
    },
  });

  if (!course) {
    return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
  }

  if (session.user.role !== "ADMIN" && course.teacher.institutionId !== session.user.institutionId) {
    return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
  }

  if (course.status !== "PUBLISHED" && course.teacherId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
  }

  const { _count, enrollments, ...details } = course;
  return NextResponse.json({
    ...details,
    enrollments: _count.enrollments,
    reviewsCount: _count.reviews,
    enrollment: enrollments[0] ?? null,
  });
}
