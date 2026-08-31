import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isTeacher = session.user.role === "TEACHER" || session.user.role === "ADMIN";

  if (isTeacher) {
    const teacherCourses = await prisma.course.findMany({
      where: {
        teacherId: session.user.id,
        ...(session.user.role !== "ADMIN"
          ? { teacher: { institutionId: session.user.institutionId ?? "__NO_INSTITUTION__" } }
          : {}),
      },
      select: { id: true, title: true },
    });

    const assignments = await prisma.assignment.findMany({
      where: { courseId: { in: teacherCourses.map((course) => course.id) } },
      include: {
        course: { select: { id: true, title: true } },
        submissions: { select: { id: true, userId: true, status: true } },
      },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(
      assignments.map((assignment) => ({
        ...assignment,
        dueDate: assignment.dueDate ? assignment.dueDate.toISOString() : null,
        submissionsCount: assignment.submissions.length,
      })),
    );
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: session.user.id,
      course: session.user.role === "ADMIN" ? undefined : { teacher: { institutionId: session.user.institutionId ?? "__NO_INSTITUTION__" } },
    },
    select: { courseId: true },
  });

  const assignments = await prisma.assignment.findMany({
    where: { courseId: { in: enrollments.map((enrollment) => enrollment.courseId) } },
    include: {
      course: { select: { id: true, title: true } },
      submissions: {
        where: { userId: session.user.id },
        select: { id: true, content: true, status: true },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(
    assignments.map((assignment) => ({
      ...assignment,
      dueDate: assignment.dueDate ? assignment.dueDate.toISOString() : null,
      submission: assignment.submissions[0] ?? null,
      submissions: undefined,
    })),
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, dueDate, courseId } = body as { title?: string; dueDate?: string; courseId?: string };

  if (!courseId || !title || !String(title).trim()) {
    return NextResponse.json({ error: "Le titre et le cours sont requis" }, { status: 400 });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, teacherId: true, teacher: { select: { institutionId: true } } },
  });
  if (!course) {
    return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });
  }

  if (session.user.role !== "ADMIN" && course.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (session.user.role !== "ADMIN" && course.teacher.institutionId !== session.user.institutionId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const assignment = await prisma.assignment.create({
    data: {
      courseId,
      title: title.trim(),
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return NextResponse.json({ ...assignment, dueDate: assignment.dueDate ? assignment.dueDate.toISOString() : null }, { status: 201 });
}
