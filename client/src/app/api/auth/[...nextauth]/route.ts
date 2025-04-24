import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import "dotenv/config";

// Extend the User and Session types
declare module "next-auth" {
  interface User {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const googleId = account.providerAccountId;

          if (
            !process.env.ACCESS_TOKEN_SECRET ||
            !process.env.REFRESH_TOKEN_SECRET
          ) {
            throw new Error("Token secrets are not configured");
          }

          const accessToken = jwt.sign(
            { id: googleId, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
          );
          const refreshToken = jwt.sign(
            { id: googleId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
          );

          cookies().set("AccessToken", accessToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60,
            sameSite: "lax",
            path: "/",
          });

          cookies().set("RefreshToken", refreshToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60,
            sameSite: "lax",
            path: "/",
          });

          // Store the tokens in the user object for jwt callback
          user.id = googleId;
          (user as any).accessToken = accessToken;
          (user as any).refreshToken = refreshToken;

          return true; // Allow sign-in
        } catch (error) {
          console.error("Token generation error:", error);
          return false; // Deny sign-in
        }
      }
      return true; // Allow sign-in for other providers
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  events: {
    async signOut() {
      cookies().delete("AccessToken");
      cookies().delete("RefreshToken");
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
