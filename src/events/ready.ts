import { Client } from "discord.js";
import logger from "../utils/logger";
import info from "../utils/info";

export default function ready(client: Client) {
  // Inform user that bot hasany started
  if (client.user === null) {
    throw new Error("Client user is null");
  }
  logger.info(`Ready! Logged in as ${client.user.tag}`);
  void info(client);
  setInterval(() => {
    void info(client);
  }, 1000 * 60 * 30);
}
