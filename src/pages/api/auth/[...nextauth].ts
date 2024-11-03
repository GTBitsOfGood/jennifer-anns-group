import NextAuth, { NextAuthOptions } from "next-auth";
import { verifyUser } from "@/server/db/actions/UserAction";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "@/components/Login/LoginForm";
import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { HTTP_STATUS_CODE } from "@/utils/consts";
/**
 *  @type {import("next-auth").NextAuthOptions}
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // If "update" is triggered, update token with session.user properties
      if (trigger === "update" && session?.user) {
        token = {
          ...token,
          ...session.user, // Overwrite token properties with session.user properties
        };
      }

      // If there is an account, merge the user properties into the token
      if (account) {
        token = {
          ...token,
          ...user, // Include user properties from authentication
        };
      }

      return token;
    },

    async session({ session, token, trigger }) {
      // Extract all the relevant user properties from token, excluding technical ones like iat, exp, jti
      const { iat, exp, jti, ...userTokenProperties } = token;

      // Create the user object for the session
      session.user = {
        ...session.user, // Ensure previous session.user properties (if any) are retained
        ...userTokenProperties, // Populate session.user with properties from token
      };

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

export const authenticate = async (
  req: NextApiRequest,
  res: NextApiResponse,
  methods: string[],
  adminRequired: boolean = false,
) => {
  if (req.method == undefined) {
    return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
      error: `No request method provided`,
    });
  }
  if (methods.includes(req.method)) {
    const session = await getServerSession(req, res, authOptions);
    if (session && (session.user.label == "administrator" || !adminRequired)) {
      return true;
    } else {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        error: "Unauthorized",
      });
    }
  }
  return true;
};

export const authenticateAdminOrSameUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  id: string,
) => {
  const session = await getServerSession(req, res, authOptions);
  if (
    !session ||
    (session.user._id !== id && !(session.user.label == "administrator"))
  ) {
    return res
      .status(HTTP_STATUS_CODE.UNAUTHORIZED)
      .send({ error: "Unvalidated or invalid user." });
  }
  return true;
};
