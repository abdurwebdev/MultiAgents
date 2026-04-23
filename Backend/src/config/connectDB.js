import mongoose from "mongoose";
import logger from "./logger.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    logger.info("MongoDB Connected");
  } catch (error) {
    logger.error("MongoDB connection failed", error);
    process.exit(1);
  }
};