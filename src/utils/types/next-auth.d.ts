import NextAuth, { DefaultSession } from "next-auth";
import { userDataSchema } from "@/components/ProfileModal/ProfileModal";
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: z.infer<typeof userDataSchema>;
  }
}
