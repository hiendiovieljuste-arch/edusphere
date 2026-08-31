import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, title: true, teacherId: true } },
      submissions: { orderBy: { submittedAt: "desc" } },
    },
  });

  if (!assignment) {
    return NextResponse.json({ error: "Devoir introuvable" }, { status: 404 });
  }

  const isTeacher = session.user.role === "TEACHER" || session.user.role === "ADMIN";
  const isOwner = assignment.course.teacherId === session.user.id;
  const hasEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: assignment.courseId } },
  });

  if (!isTeacher && !isOwner && !hasEnrollment) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    ...assignment,
    dueDate: assignment.dueDate ? assignment.dueDate.toISOString() : null,
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: { course: { select: { teacherId: true } } },
  });

  if (!assignment) {
    return NextResponse.json({ error: "Devoir introuvable" }, { status: 404 });
  }

  if (session.user.role !== "ADMIN" && assignment.course.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const update: { title?: string; dueDate?: Date | null } = {};

  if (body.title && String(body.title).trim()) update.title = String(body.title).trim();
  if (body.dueDate !== undefined) update.dueDate = body.dueDate ? new Date(body.dueDate) : null;

  const updated = await prisma.assignment.update({
    where: { id },
    data: update,
  });

  return NextResponse.json({ ...updated, dueDate: updated.dueDate ? updated.dueDate.toISOString() : null });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "TEACHER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: { course: { select: { teacherId: true } } },
  });

  if (!assignment) {
    return NextResponse.json({ error: "Devoir introuvable" }, { status: 404 });
  }

  if (session.user.role !== "ADMIN" && assignment.course.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.assignment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
