/**
 * Registers commands to the DEV_GUILD_ID (fast iteration).
 * Run via: npm run register-commands
 */
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { config } from "./config";
import { data as pickData } from "./commands/pickOfTheDay";
import { logger } from "./utils/logger";

async function register() {
  if (!config.clientId || !config.token || !config.devGuildId) {
    throw new Error("DISCORD_CLIENT_ID, DEV_GUILD_ID, or DISCORD_TOKEN missing in env");
  }

  const rest = new REST({ version: "10" }).setToken(config.token);
  const commands = [pickData.toJSON()];

  try {
    logger.info("Registering commands to dev guild %s", config.devGuildId);
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.devGuildId),
      { body: commands }
    );
    logger.info("Commands registered.");
  } catch (err) {
    logger.error(err, "Failed to register commands");
    process.exit(1);
  }
}

register();
