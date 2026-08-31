import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    summary: [
      { label: "Paiements reçus", value: "€1.62M", trend: "+12.4%" },
      { label: "Frais à venir", value: "€420K", trend: "+3.1%" },
      { label: "Bourses", value: "€310K", trend: "-1.2%" },
      { label: "Budget restant", value: "€890K", trend: "+7.8%" },
    ],
    rows: [
      { category: "Frais de scolarité", amount: "€540K", due: "92%" },
      { category: "Logement", amount: "€310K", due: "76%" },
      { category: "Laboratoires", amount: "€220K", due: "68%" },
      { category: "Bourses", amount: "€180K", due: "88%" },
    ],
  });
}
