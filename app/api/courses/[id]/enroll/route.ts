import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Veuillez vous connecter pour vous inscrire." }, { status: 401 });

  const { id: courseId } = await params;
  const course = await prisma.course.findFirst({ where: { id: courseId, status: "PUBLISHED" }, select: { id: true } });
  if (!course) return NextResponse.json({ error: "Cours introuvable" }, { status: 404 });

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    create: { userId: session.user.id, courseId },
    update: { status: "ACTIVE" },
  });
  return NextResponse.json(enrollment, { status: 201 });
}
