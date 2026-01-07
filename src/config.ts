import dotenv from "dotenv";
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN || "",
  clientId: process.env.DISCORD_CLIENT_ID || "",
  devGuildId: process.env.DEV_GUILD_ID || "",
  databaseUrl: process.env.DATABASE_URL || "file:./dev.db",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info"
};
