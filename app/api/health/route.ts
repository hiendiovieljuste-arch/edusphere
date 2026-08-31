import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    name: "EduSphere",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}
