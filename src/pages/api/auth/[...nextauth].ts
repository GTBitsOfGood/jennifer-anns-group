import NextAuth from "next-auth";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import {IUser} from "@/server/db/models/UserModel";
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
    callbacks: {
        async signIn({user}) {
            if (user?.error === "Email not found") {
                throw new Error("Email Not Found");
            }else if (user?.error === "Password Incorrect") {
                throw new Error("Password Incorrect");
            }else {
                return true;
            }


        }

    },
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Login with Email and Password",
            credentials: {
                email: {label: "Email", type: "text",placeholder:""},
                password: {label: "Password",type: "password"}
            },
            async authorize(credentials) { //What am I doing here.
                if (credentials === undefined) {
                    return null;
                }
                const {email, password} = credentials;
                console.log("Verifying user!!");
                if (!email || !password) {
                    return null;
                }
                const response = await verifyUser(email,password);
                console.log(response);
                if (response.status === 200) {
                    return response.message; //Make sure this message includes user._id.
                }else {
                    if (response.status === 404) {
                        return {error: "Email not found"}
                    }else {
                        return {error: "Password Incorrect"}
                    }
                }

            }

        })
    ]
}

export default NextAuth(authOptions);