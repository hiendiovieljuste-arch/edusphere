export const DEMO_MODE = true;

export const demoSessionUser = {
  id: "demo-admin",
  name: "Demo Admin",
  email: "admin@demo.local",
  role: "ADMIN" as const,
  institutionId: null,
  programId: null,
  promotionId: null,
  classId: null,
};

export const demoSession = {
  user: demoSessionUser,
};
