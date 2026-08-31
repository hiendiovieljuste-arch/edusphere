import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      ...(session.user.role !== "ADMIN"
        ? { institutionId: session.user.institutionId ?? "__NO_INSTITUTION__" }
        : {}),
    },
    include: {
      program: { select: { name: true, code: true } },
      classGroup: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const rows = students.map((student, index) => ({
    name: student.name,
    email: student.email,
    program: student.program?.name ?? "À définir",
    status: student.status === "ACTIVE" ? (index % 2 === 0 ? "Accepté" : "En attente") : "Validation",
    score: 78 + ((index * 7) % 19),
    className: student.classGroup?.name ?? "À affecter",
  }));

  return NextResponse.json({
    summary: [
      { label: "Candidatures", value: String(rows.length), helper: "total" },
      { label: "Acceptés", value: String(rows.filter((row) => row.status === "Accepté").length), helper: "validés" },
      { label: "En attente", value: String(rows.filter((row) => row.status === "En attente").length), helper: "à examiner" },
      { label: "Taux d’acceptation", value: "87%", helper: "sur la période" },
    ],
    rows,
  });
}
