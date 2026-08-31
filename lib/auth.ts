import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            institutionId: true,
            programId: true,
            promotionId: true,
            classId: true,
            password: true,
          },
        });

        if (!user || !(await compare(credentials.password, user.password))) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          institutionId: user.institutionId,
          programId: user.programId,
          promotionId: user.promotionId,
          classId: user.classId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.institutionId = user.institutionId ?? null;
        token.programId = user.programId ?? null;
        token.promotionId = user.promotionId ?? null;
        token.classId = user.classId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id && token.role) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.institutionId = token.institutionId ?? null;
        session.user.programId = token.programId ?? null;
        session.user.promotionId = token.promotionId ?? null;
        session.user.classId = token.classId ?? null;
      }
      return session;
    },
  },
  pages: { signIn: "/login", newUser: "/signup" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
