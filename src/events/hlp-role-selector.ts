import { GuildMember, StringSelectMenuInteraction } from "discord.js";
import logger from "../utils/logger";
import { memberId } from "../utils/type";
import config from "../utils/config";
import { CommandArgumentError, RoleChangeFailedError } from "../utils/errors";

const { allRoleIds } = config;

export default async function hlpRoleSelector(
  interaction: StringSelectMenuInteraction
) {
  try {
    // Get user roles and selected roles
    const member = interaction.member;
    if (!(member instanceof GuildMember)) {
      throw new CommandArgumentError("Member is not of type GuildMember");
    }
    const userRoles = member.roles;
    const roles = interaction.values;

    // If it includes 1 => None - remove all roles
    if (roles.includes("1")) {
      // Remove all roles from the user
      for (const element of allRoleIds) {
        // Check if user has the role
        if (userRoles.cache.has(element)) {
          await userRoles.remove(element);
        }
      }
      await interaction.reply({
        content: "Vaše role byly aktualizovány",
        ephemeral: true,
      });
      return;
    }

    // If it doesn't include 1 => user wants to change his roles
    // Go thru all roles
    for (const element of allRoleIds) {
      // If user already has role
      if (userRoles.cache.has(element)) {
        // If selected roles includes the role -> user wants that role
        if (roles.includes(element)) continue;
        // Otherwise user doesn't want that role
        await userRoles.remove(element);
      } else {
        // User doesn't have the role
        // Does he want it ?
        if (!roles.includes(element)) continue;
        // If yes than give it to him
        await userRoles.add(element);
      }
    }
  } catch {
    await interaction.reply({
      content:
        "Nepodařilo se aktualizovat vaše role, zkuste to prosím znovu později.",
      ephemeral: true,
    });
    throw new RoleChangeFailedError(interaction.user.id);
  }

  logger.info(`Changed roles for user ${memberId(interaction.member)}`);
  await interaction.reply({
    content: "Vaše role byly aktualizovány.",
    ephemeral: true,
  });
}
