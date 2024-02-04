import NextAuth, { User } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import { verifyUser } from "@/server/db/actions/UserAction";
import CredentialsProvider from "next-auth/providers/credentials";
import { uri } from "@/server/db/mongodb";
//Use MongoClient to connect to MongoDB database.
let cachedPromise: Promise<MongoClient>;
const options = {};
if (!uri) {
  throw new Error("MONGODB_URI should be an environment variable.");
}
const client = new MongoClient(uri, options);

declare module "next-auth" {
  interface User {
    error: string;
  }
}

const retrievePromise = () => {
  if (cachedPromise) {
    return cachedPromise;
  } else {
    cachedPromise = client.connect();
    return cachedPromise;
  }
};

/**
 *  @type {import("next-auth").NextAuthOptions}
 */

export const authOptions = {
  adapter: MongoDBAdapter(retrievePromise()),
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: { user: User }) {
      if (user?.error === "Email not found") {
        throw new Error("Email Not Found");
      } else if (user?.error === "Password Incorrect") {
        throw new Error("Password Incorrect");
      } else {
        return true;
      }
    },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Login with Email and Password",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        //What am I doing here.
        if (credentials === undefined) {
          return null;
        }
        const { email, password } = credentials;
        if (!email || !password) {
          return null;
        }
        const response = await verifyUser(email, password);
        if (response.status === 200) {
          return response.message; //Make sure this message includes user._id.
        } else {
          if (response.status === 404) {
            return { error: "Email not found" };
          } else {
            return { error: "Password Incorrect" };
          }
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
