import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in .env");

  // Recommended options for stability & security
  mongoose.set("strictQuery", true);
  mongoose.set("sanitizeFilter", true);

  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err?.message || err);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected");
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    // tls true is enforced by the connection string (?tls=true)
    // retryWrites enabled by connection string
  });
};
