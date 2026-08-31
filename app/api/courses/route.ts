import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const courses = await prisma.course.findMany({
      where: { status: "PUBLISHED" },
      include: {
        teacher: { select: { id: true, name: true, avatar: true } },
        enrollments: session ? { where: { userId: session.user.id } } : false,
        _count: { select: { enrollments: true, reviews: true } },
      },
      take: 20,
    });

    return NextResponse.json(
      courses.map((course) => ({
        ...course,
        reviews: course._count.reviews,
        enrollments: course._count.enrollments,
        enrolled: session ? course.enrollments.length > 0 : false,
        _count: undefined,
      })),
    );
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const allowedRoles = ["TEACHER", "ADMIN"];
    if (!session || !allowedRoles.includes(session.user?.role ?? "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, description, level, category } = await req.json();
    if (![title, level, category].every((value) => typeof value === "string" && value.trim())) {
      return NextResponse.json({ error: "Les champs titre, niveau et catégorie sont requis" }, { status: 400 });
    }

    const baseSlug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const slug = `${baseSlug || "cours"}-${Date.now()}`;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        level,
        category,
        slug,
        teacherId: session.user.id,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
