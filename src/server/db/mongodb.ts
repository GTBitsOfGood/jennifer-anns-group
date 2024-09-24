import mongoose, { Connection } from "mongoose";

export const uri = process.env.MONGODB_URI;

if (!uri) {
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
    return cached.conn as Connection;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose.connection as Connection;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(
      `New connection established. Connection state: ${cached.conn.readyState}`,
    );
    console.log(`Connected to database: ${cached.conn.db.databaseName}`);
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error("Failed to connect to MongoDB", e);
    throw e;
  }
};

export default connectMongoDB;
