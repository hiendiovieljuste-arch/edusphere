import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stats = [
    { label: "Présence", value: "96%", helper: "sur la semaine" },
    { label: "Heures validées", value: "132h", helper: "ce mois" },
    { label: "Absences", value: "3", helper: "justifiées" },
  ];

  const days = [
    { day: "Lun", status: "Présent" },
    { day: "Mar", status: "Présent" },
    { day: "Mer", status: "Présent" },
    { day: "Jeu", status: "Absent" },
    { day: "Ven", status: "Présent" },
  ];

  return NextResponse.json({ stats, days });
}
