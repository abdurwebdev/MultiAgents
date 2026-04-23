import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

// ✅ Keep console in ALL environments (important for cloud)
logger.add(
  new transports.Console({
    format:
      process.env.NODE_ENV === "production"
        ? format.json()
        : format.combine(format.colorize(), format.simple()),
  })
);

export default logger;