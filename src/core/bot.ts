import { Client, GatewayIntentBits } from "discord.js";
import { config } from "../config";
import { logger } from "../utils/logger";

export const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

export function initBotListeners() {
  client.once("ready", () => {
    logger.info({ user: client.user?.tag }, "Bot ready");
  });

  client.on("error", (err) => {
    logger.error(err, "Discord client error");
  });
}

export async function login() {
  if (!config.token) throw new Error("DISCORD_TOKEN is not set");
  await client.login(config.token);
}
