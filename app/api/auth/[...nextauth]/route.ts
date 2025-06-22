import NextAuth, { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "../../../../lib/prisma";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }: { user: User }) {
      // Upsert user in DB
      await prisma.user.upsert({
        where: { email: user.email || "" },
        update: {
          name: user.name,
          image: user.image,
        },
        create: {
          email: user.email || "",
          name: user.name,
          image: user.image,
        },
      });
      return true; // allow sign in
    },

    async session({ session }: { session: Session }) {
      // Attach user id to the session object
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          session.user.id = dbUser.id; // add user id to session
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
