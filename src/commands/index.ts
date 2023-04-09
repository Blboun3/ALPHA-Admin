import { ChatInputCommandInteraction, DiscordjsError } from "discord.js";
import apply from "./administration/apply";
import specialmessage from "./administration/specialmessage";
import rules from "./fun/rules";
import announce from "./utilities/announce";
import user from "./fun/user";
import status from "./utilities/status";
import ticket from "./utilities/ticket";
import logger from "../utils/logger";
import { AlphaError } from "../utils/errors";

export const data = [
  apply.data.toJSON(),
  specialmessage.data.toJSON(),
  rules.data.toJSON(),
  user.data.toJSON(),
  announce.data.toJSON(),
  status.data.toJSON(),
  ticket.data.toJSON(),
];

function run(interaction: ChatInputCommandInteraction) {
  const command = interaction.commandName;
  switch (command) {
    case "apply": {
      return apply.execute(interaction);
    }
    case "specialmessage": {
      return specialmessage.execute(interaction);
    }
    case "rules": {
      return rules.execute(interaction);
    }
    case "user": {
      return user.execute(interaction);
    }
    case "announce": {
      return announce.execute(interaction);
    }
    case "status": {
      return status.execute(interaction);
    }
    case "ticket": {
      return ticket.execute(interaction);
    }
    default: {
      throw new Error(`Command ${command} not found.`);
    }
  }
}

export default async function execute(
  interaction: ChatInputCommandInteraction
) {
  try {
    await run(interaction);
  } catch (error) {
    const child = logger.child({ error: error, interaction: interaction });
    if (error instanceof AlphaError) {
      child.error("An error occured during command execution.");
    } else if (error instanceof DiscordjsError) {
      child.error("A DiscordJS error occured during command execution.");
    }
  }
}
