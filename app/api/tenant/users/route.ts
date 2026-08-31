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
  const canSeeAll = session.user.role === "ADMIN";

  const users = await prisma.user.findMany({
    where: canSeeAll ? {} : { institutionId: institutionId ?? undefined },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      institution: { select: { id: true, name: true } },
      program: { select: { id: true, name: true } },
      promotion: { select: { id: true, name: true } },
      classGroup: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ users });
}
