import mongoose from "mongoose";

const MONGODB_LINK = process.env.MONGODB_LINK;

if (!MONGODB_LINK) {
  // Graceful fallback for demo/in-memory mode
  console.warn("MONGODB_LINK environment variable is not set; running with in-memory store.");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase() {
  if (!MONGODB_LINK) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_LINK, opts).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
