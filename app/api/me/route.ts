import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const profileFields = { id: true, name: true, email: true, bio: true, avatar: true, role: true, createdAt: true } as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: profileFields });
  return NextResponse.json(user);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> | null = null;

  try {
    const parsed = await request.json();
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      body = parsed as Record<string, unknown>;
    }
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!name || name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Le nom doit contenir entre 2 et 80 caractères." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Un compte avec cet email existe déjà." }, { status: 409 });
  }

  const created = await prisma.user.create({
    data: {
      name,
      email,
      password: await hash(password, 10),
      role: "STUDENT",
    },
    select: profileFields,
  });

  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const data: { name?: string; bio?: string | null } = {};
  if (typeof body.name === "string") { const name = body.name.trim(); if (name.length < 2 || name.length > 80) return NextResponse.json({ error: "Le nom doit contenir entre 2 et 80 caractères." }, { status: 400 }); data.name = name; }
  if (typeof body.bio === "string" || body.bio === null) { if (typeof body.bio === "string" && body.bio.length > 500) return NextResponse.json({ error: "La bio ne peut pas dépasser 500 caractères." }, { status: 400 }); data.bio = body.bio?.trim() || null; }
  if (!Object.keys(data).length) return NextResponse.json({ error: "Aucune modification valide." }, { status: 400 });
  const user = await prisma.user.update({ where: { id: session.user.id }, data, select: profileFields });
  return NextResponse.json(user);
}
