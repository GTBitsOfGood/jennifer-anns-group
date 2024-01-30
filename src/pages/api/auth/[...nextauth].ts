import NextAuth from "next-auth";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";

import UserModel from "@/server/db/models/UserModel";
import {MongoClient, ObjectId} from "mongodb";
import { verifyUser } from "@/server/db/actions/UserAction";
import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongoDB from "@/server/db/mongodb";
//Use MongoClient to connect to MongoDB database. 
let cachedPromise: Promise<MongoClient>;
const options = {};
const URI = process.env.MONGODB_URI;
if (!URI) {
    throw new Error("MONGODB_URI should be an environment variable.");
}
const client = new MongoClient(URI,options);

const retrievePromise = () => {
    if (cachedPromise) {
        return cachedPromise;
    }else {
        cachedPromise = client.connect()
        return cachedPromise;
    }
}

interface Credentials {
    email: string;
    password: string;
}
/**
 *  @type {import("next-auth").NextAuthOptions}
 */

export const authOptions = {
    adapter: MongoDBAdapter(retrievePromise()),
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Login with Email and Password",
            credentials: {
                email: {label: "Email", type: "text",placeholder:""},
                password: {label: "Password",type: "password"}
            },
            async authorize(credentials: any): Promise<any> { //What am I doing here.
                const {email, password} = credentials as Credentials;

                if (!email || !password) {
                    return null;
                }
                const response = await verifyUser(email,password);
                if (response.status === 200) {
                    return response.message; //Make sure this message includes user._id.
                }else {
                    return null;
                }

            }

        })
    ]
}

export default NextAuth(authOptions);