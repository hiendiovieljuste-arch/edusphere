import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [institutions, programs, promotions, classes, students, teachers, courses] = await Promise.all([
    prisma.institution.findMany({
      include: {
        programs: {
          include: {
            promotions: { include: { classes: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.program.count(),
    prisma.promotion.count(),
    prisma.studentClass.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.course.count(),
  ]);

  return NextResponse.json({
    summary: {
      institutions: institutions.length,
      programs,
      promotions,
      classes,
      students,
      teachers,
      courses,
    },
    institutions,
  });
}
