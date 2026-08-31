import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isTeacherOrAdmin = session.user.role === "TEACHER" || session.user.role === "ADMIN";

  if (isTeacherOrAdmin) {
    const users = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        ...(session.user.role !== "ADMIN"
          ? { institutionId: session.user.institutionId ?? "__NO_INSTITUTION__" }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        classGroup: { select: { name: true } },
      },
      take: 6,
    });

    return NextResponse.json({
      mode: "management",
      overview: [
        { label: "Moyenne générale", value: "88.4%", helper: "classe de référence" },
        { label: "Réussite", value: "92.7%", helper: "taux global" },
        { label: "Rang moyen", value: "#4", helper: "pour la promotion" },
        { label: "Évaluations", value: "14", helper: "en cours" },
      ],
      rows: users.map((user, index) => ({
        student: user.name,
        email: user.email,
        className: user.classGroup?.name ?? "Aucune class",
        score: 82 + index * 4,
        average: 84 + (index % 3),
        status: index % 2 === 0 ? "Correct" : "À renforcer",
      })),
    });
  }

  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      classGroup: { select: { name: true } },
    },
  });

  const rows = [
    { matiere: "Mathématiques", note: 18, coeff: 4, moyenne: 17.8 },
    { matiere: "Physique", note: 16, coeff: 3, moyenne: 15.6 },
    { matiere: "Informatique", note: 19, coeff: 5, moyenne: 18.4 },
    { matiere: "Français", note: 17, coeff: 2, moyenne: 16.7 },
  ];

  return NextResponse.json({
    mode: "student",
    student: {
      name: student?.name ?? session.user.name,
      className: student?.classGroup?.name ?? "Aucune classe",
    },
    overview: [
      { label: "Moyenne générale", value: "17.5/20", helper: "global" },
      { label: "Devoirs rendus", value: "12/14", helper: "en cours" },
      { label: "Rang classe", value: "#3", helper: "promotion" },
      { label: "Cohérence", value: "92%", helper: "tendance" },
    ],
    rows,
  });
}
