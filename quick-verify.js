// quick-verify.js — quick login check for DISCORD_TOKEN
// Usage: npx dotenv -e .env -- node quick-verify.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

if (!process.env.DISCORD_TOKEN) {
  console.error('Missing DISCORD_TOKEN in environment');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.destroy();
  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN).catch(err => {
  console.error('Login failed:', err.message || err);
  process.exit(1);
});