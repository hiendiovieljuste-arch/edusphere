import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    role: session.user.role,
    permissions: {
      admin: session.user.role === "ADMIN",
      manageStudents: ["ADMIN", "TEACHER"].includes(session.user.role),
      manageFinance: session.user.role === "ADMIN",
      managePrograms: session.user.role === "ADMIN",
      viewInstitution: ["ADMIN", "TEACHER", "STUDENT"].includes(session.user.role),
    },
    institution: {
      id: session.user.institutionId ?? null,
      programId: session.user.programId ?? null,
      promotionId: session.user.promotionId ?? null,
      classId: session.user.classId ?? null,
    },
  });
}
