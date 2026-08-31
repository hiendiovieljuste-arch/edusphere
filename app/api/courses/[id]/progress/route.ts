import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { progress } = await request.json();
  if (typeof progress !== "number" || !Number.isFinite(progress) || progress < 0 || progress > 100) {
    return NextResponse.json({ error: "Progression invalide" }, { status: 400 });
  }
  const { id: courseId } = await params;
  try {
    const enrollment = await prisma.enrollment.update({
      where: { userId_courseId: { userId: session.user.id, courseId } },
      data: { progress, status: progress === 100 ? "COMPLETED" : "ACTIVE", completedAt: progress === 100 ? new Date() : null },
    });
    return NextResponse.json(enrollment);
  } catch {
    return NextResponse.json({ error: "Inscription requise pour suivre la progression" }, { status: 403 });
  }
}
