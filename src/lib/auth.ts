import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.dude.box' : undefined,
      },
    },
  },
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

        const submittedEmail = credentials.email.toLowerCase().trim();

        try {
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: submittedEmail },
          });

          if (!user) {
            console.log("User not found:", submittedEmail);
            return null;
          }

          // Verify password with bcrypt
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          if (!isPasswordValid) {
            console.log("Invalid password for user:", submittedEmail);
            return null;
          }

          // Return user data for session
          const fullName = [user.first_name, user.last_name]
            .filter(Boolean)
            .join(" ")
            .trim();

          return {
            id: user.id,
            name: fullName || submittedEmail.split("@")[0],
            email: user.email,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/portal/login",
    signOut: "/",
    // Default callback after sign-in is now /members (member dashboard)
  },
  debug: true, // Enable in production to debug sign-out issues
  events: {
    async signOut() {
      // Log sign-out event for debugging
      console.log("User signed out successfully");
    },
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Add user ID to token on sign in
      if (user) {
        token.id = user.id;
      }
      
      // Handle token refresh/update
      if (trigger === "update") {
        // Token refresh logic - could fetch fresh user data here if needed
        return token;
      }
      
      return token;
    },
    async session({ session, token }) {
      // Add user ID to session
      if (token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
