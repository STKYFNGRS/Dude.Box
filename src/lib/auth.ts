import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Member Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const allowedEmail = process.env.MEMBER_LOGIN_EMAIL?.toLowerCase().trim();
        const allowedPassword = process.env.MEMBER_LOGIN_PASSWORD;
        const submittedEmail = credentials.email.toLowerCase().trim();

        if (!allowedEmail || !allowedPassword) {
          return null;
        }

        if (submittedEmail === allowedEmail && credentials.password === allowedPassword) {
          return {
            id: "member-1",
            name: "Member",
            email: allowedEmail,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/portal/login",
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
};
