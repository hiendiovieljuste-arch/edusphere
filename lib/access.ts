import { Session } from "next-auth";

export type AppRole = "ADMIN" | "TEACHER" | "STUDENT";

export function hasAnyRole(session: Session | null, roles: AppRole[]) {
  if (!session?.user?.role) return false;
  return roles.includes(session.user.role as AppRole);
}

export function getInstitutionScope(session: Session | null) {
  if (!session?.user) return null;
  return {
    institutionId: session.user.institutionId ?? null,
    programId: session.user.programId ?? null,
    promotionId: session.user.promotionId ?? null,
    classId: session.user.classId ?? null,
  };
}

export function buildInstitutionScopeFilter(session: Session | null) {
  if (!session?.user) return { id: "__NO_USER__" };
  if (session.user.role === "ADMIN") return {};
  return { id: session.user.institutionId ?? "__NO_INSTITUTION__" };
}

export function buildScopedUserFilter(session: Session | null, role?: AppRole | "ALL") {
  if (!session?.user) return { id: "__NO_USER__" };

  if (session.user.role === "ADMIN") {
    return role && role !== "ALL" ? { role } : {};
  }

  const base = { institutionId: session.user.institutionId ?? "__NO_INSTITUTION__" };
  return role && role !== "ALL" ? { ...base, role } : base;
}

export function canAccessInstitution(session: Session | null, institutionId?: string | null) {
  if (!session?.user) return false;
  if (session.user.role === "ADMIN") return true;
  return !!institutionId && institutionId === session.user.institutionId;
}

export function canAccessProgram(session: Session | null, programId?: string | null) {
  if (!session?.user) return false;
  if (session.user.role === "ADMIN") return true;
  if (!programId) return false;
  return programId === session.user.programId;
}

export function canAccessPromotion(session: Session | null, promotionId?: string | null) {
  if (!session?.user) return false;
  if (session.user.role === "ADMIN") return true;
  if (!promotionId) return false;
  return promotionId === session.user.promotionId;
}

export function canAccessCourse(session: Session | null, course?: { teacherId?: string | null; teacher?: { institutionId?: string | null } | null; institutionId?: string | null } | null) {
  if (!session?.user) return false;
  if (session.user.role === "ADMIN") return true;
  if (!course) return false;

  const directTeacherMatch = course.teacherId === session.user.id;
  const sameInstitution = course.teacher?.institutionId === session.user.institutionId || course.institutionId === session.user.institutionId;
  return directTeacherMatch || sameInstitution;
}
