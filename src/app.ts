/*
ALPHA Admin Discord Bot
Autor: Blboun3
*/
// Import libraries
import { Client, GatewayIntentBits } from "discord.js";
import config from "./utils/config";
import bindEvents from "./events";

// Create a new bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

bindEvents(client);

void client.login(config.token);
