import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isTeacher = session.user.role === "TEACHER" || session.user.role === "ADMIN";
  const scopedCourseFilter = session.user.role === "ADMIN" ? {} : { teacher: { institutionId: session.user.institutionId ?? "__NO_INSTITUTION__" } };

  let normalizedCourses: Array<{ progress?: number; enrollments: number }>;
  if (isTeacher) {
    const courses = await prisma.course.findMany({
      where: {
        teacherId: session.user.id,
        ...scopedCourseFilter,
      },
      include: {
        teacher: { select: { name: true, avatar: true, institutionId: true } },
        _count: { select: { enrollments: true, reviews: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
    });
    normalizedCourses = courses.map((course) => ({ ...course, reviews: course._count.reviews, enrollments: course._count.enrollments }));
  } else {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: session.user.id,
        course: scopedCourseFilter,
      },
      include: {
        course: {
          include: {
            teacher: { select: { name: true, avatar: true, institutionId: true } },
            _count: { select: { enrollments: true, reviews: true } },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
      take: 6,
    });
    normalizedCourses = enrollments.map((entry) => ({ ...entry.course, progress: entry.progress, reviews: entry.course._count.reviews, enrollments: entry.course._count.enrollments }));
  }
  const notifications = await prisma.notification.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 4 });
  const averageProgress = isTeacher ? 0 : normalizedCourses.length ? Math.round(normalizedCourses.reduce((sum, course) => sum + (course.progress ?? 0), 0) / normalizedCourses.length) : 0;
  const students = isTeacher ? normalizedCourses.reduce((sum, course) => sum + course.enrollments, 0) : 0;
  return NextResponse.json({ courses: normalizedCourses, notifications, metrics: { courseCount: normalizedCourses.length, students, averageProgress, completedCourses: isTeacher ? 0 : normalizedCourses.filter((course) => course.progress === 100).length } });
}
