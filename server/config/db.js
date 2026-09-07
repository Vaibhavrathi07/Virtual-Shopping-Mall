const mongoose = require("mongoose");

// Cached across invocations so serverless platforms (Vercel) reuse one
// connection instead of opening a new one on every function call.
let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB connected: ${cached.conn.connection.host}`);
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error(`MongoDB connection error: ${err.message}`);
    // Only exit the process in a traditional long-running server;
    // in a serverless function that would kill the whole runtime.
    if (!process.env.VERCEL) process.exit(1);
    throw err;
  }
};

module.exports = connectDB;
