import mongoose, { Connection } from "mongoose";

export const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Error: MONGODB_URI environment variable is not defined");
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env",
  );
}

declare global {
  var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null } as {
    conn: Connection | null;
    promise: Promise<Connection> | unknown;
  };
}

const connectMongoDB = async () => {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn as Connection;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongoose) => {
        return mongoose.connection as Connection;
      })
      .catch((error) => {
        console.error("MongoDB connection promise failed:", error);
        cached.promise = null; // Reset promise to allow retry on next call
        throw new Error(
          "MongoDB connection failed. Check your connection settings.",
        );
      });
  }

  try {
    cached.conn = await cached.promise;
    if (cached.conn.readyState === 1) {
      // Connection is open
      console.log("New connection established.");
      console.log(`Connected to database: ${cached.conn.db.databaseName}`);
    } else {
      console.error(
        "MongoDB connection state is not 'open'. State:",
        cached.conn.readyState,
      );
      throw new Error(
        "MongoDB connection state is not 'open'. Please check the connection.",
      );
    }
    return cached.conn;
  } catch (error) {
    cached.promise = null; // Reset cached promise on failure
    console.error("Failed to connect to MongoDB:", error);
    throw new Error(
      "Failed to connect to MongoDB. Please check your MongoDB URI and network.",
    );
  }
};

export default connectMongoDB;
