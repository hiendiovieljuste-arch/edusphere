import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Initialisation sécurisée d'EduSphere...");

  await prisma.submission.deleteMany().catch(() => {});
  await prisma.assignment.deleteMany().catch(() => {});
  await prisma.review.deleteMany().catch(() => {});
  await prisma.enrollment.deleteMany().catch(() => {});
  await prisma.lesson.deleteMany().catch(() => {});
  await prisma.module.deleteMany().catch(() => {});
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.message.deleteMany().catch(() => {});
  await prisma.course.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  const institution = await prisma.institution.create({
    data: {
      name: "Établissement principal",
      shortName: "EP",
      type: "UNIVERSITY",
      country: "FR",
      status: "ACTIVE",
    },
  });

  const program = await prisma.program.create({
    data: {
      institutionId: institution.id,
      name: "Administration & Système",
      code: "ADMIN-2026",
      level: "UNDERGRADUATE",
    },
  });

  const promotion = await prisma.promotion.create({
    data: {
      programId: program.id,
      name: "Promotion 2026",
      year: "2026",
      status: "ACTIVE",
    },
  });

  const classGroup = await prisma.studentClass.create({
    data: {
      promotionId: promotion.id,
      name: "Classe admin",
      code: "ADMIN-01",
      capacity: 25,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "justehien2006@gmail.com",
      password: await hash("Justehien2006", 10),
      name: "Administrateur principal",
      role: "ADMIN",
      institutionId: institution.id,
      programId: program.id,
      promotionId: promotion.id,
      classId: classGroup.id,
    },
  });

  console.log(`✅ Admin principal créé: ${admin.email}`);
  console.log("✅ Données de démonstration supprimées");
  console.log("🎉 Initialisation sécurisée terminée");
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
