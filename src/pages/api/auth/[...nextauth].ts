import NextAuth from "next-auth";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";

import UserModel from "@/server/db/models/UserModel";
import {MongoClient, ObjectId} from "mongodb";
import { verifyUser } from "@/server/db/actions/UserAction";
import { CredentialsProvider } from 'next-auth/providers';


