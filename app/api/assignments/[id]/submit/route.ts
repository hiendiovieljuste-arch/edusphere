import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "TEACHER" || session.user.role === "ADMIN") {
    return NextResponse.json({ error: "Les enseignants ne peuvent pas soumettre de devoirs" }, { status: 403 });
  }

  const { id } = await params;
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: { course: { select: { id: true } } },
  });

  if (!assignment) {
    return NextResponse.json({ error: "Devoir introuvable" }, { status: 404 });
  }

  const hasEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: assignment.courseId } },
  });

  if (!hasEnrollment) {
    return NextResponse.json({ error: "Vous devez être inscrit à ce cours" }, { status: 403 });
  }

  const body = await req.json();
  const content = String(body.content ?? "").trim();
  if (!content) {
    return NextResponse.json({ error: "La réponse est vide" }, { status: 400 });
  }

  const submission = await prisma.submission.upsert({
    where: {
      assignmentId_userId: {
        assignmentId: id,
        userId: session.user.id,
      },
    },
    create: {
      assignmentId: id,
      userId: session.user.id,
      content,
      status: "PENDING",
    },
    update: {
      content,
      status: "PENDING",
      submittedAt: new Date(),
    },
  });

  return NextResponse.json(submission, { status: 201 });
}
