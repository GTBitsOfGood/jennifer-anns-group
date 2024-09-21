import NextAuth, { NextAuthOptions } from "next-auth";
import { verifyUser } from "@/server/db/actions/UserAction";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "@/components/Login/LoginForm";

/**
 *  @type {import("next-auth").NextAuthOptions}
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      const { iat, exp, jti, ...otherUser } = token;

      const user = {
        _id: token._id,
        ...otherUser,
      };
      session.user = user;
      console.log("Session", session.user);
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      // See https://stackoverflow.com/questions/74089665/next-auth-credentials-provider-authorize-type-error
      async authorize(credentials): Promise<any> {
        if (!credentials) return null;

        const parse = loginSchema.safeParse(credentials);
        if (!parse.success) return null;

        const { email, password } = credentials;
        const user = await verifyUser(email, password);

        return user;
      },
    }),
  ],
};

export default NextAuth(authOptions);
