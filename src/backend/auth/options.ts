import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticatePasswordUser } from "@/backend/service/user";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const user = await authenticatePasswordUser(email, password);
        if (!user) {
          return null;
        }

        return {
          id: user.uuid,
          uuid: user.uuid,
          email: user.email,
          name: user.nickname,
          nickname: user.nickname,
          image: user.avatar_url,
          avatar_url: user.avatar_url,
          created_at: user.created_at,
        } as any;
      },
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}/`;
    },
    async session({ session, token }) {
      if (token && token.user) {
        session.user = token.user as any;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as any;
        token.user = {
          uuid: authUser.uuid || authUser.id,
          nickname: authUser.nickname || authUser.name || "",
          email: authUser.email || "",
          avatar_url: authUser.avatar_url || authUser.image || "",
          created_at: authUser.created_at,
        };
      }

      return token;
    },
  },
};
