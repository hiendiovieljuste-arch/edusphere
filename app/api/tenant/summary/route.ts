import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const institutionId = session.user.institutionId;

  if (!institutionId && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Institution not found" }, { status: 404 });
  }

  const [institutions, programs, promotions, classes, students, teachers] = await Promise.all([
    prisma.institution.count({
      where: session.user.role === "ADMIN" ? {} : { id: institutionId ?? undefined },
    }),
    prisma.program.count({
      where: session.user.role === "ADMIN" ? {} : { institutionId: institutionId ?? undefined },
    }),
    prisma.promotion.count({
      where: session.user.role === "ADMIN" ? {} : { program: { institutionId: institutionId ?? undefined } },
    }),
    prisma.studentClass.count({
      where: session.user.role === "ADMIN" ? {} : { promotion: { program: { institutionId: institutionId ?? undefined } } },
    }),
    prisma.user.count({
      where: session.user.role === "ADMIN" ? { role: "STUDENT" } : { role: "STUDENT", institutionId: institutionId ?? undefined },
    }),
    prisma.user.count({
      where: session.user.role === "ADMIN" ? { role: "TEACHER" } : { role: "TEACHER", institutionId: institutionId ?? undefined },
    }),
  ]);

  return NextResponse.json({
    institutionScope: institutionId,
    summary: {
      institutions,
      programs,
      promotions,
      classes,
      students,
      teachers,
    },
  });
}
