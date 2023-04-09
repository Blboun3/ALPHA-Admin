import {
  BaseInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import hlpApplicationRequest from "./hlp-application-request";
import hlpRoleSelector from "./hlp-role-selector";
import hlpVerify from "./hlp-verify";
import execute from "../commands";

export default async function interactionCreate(interaction: BaseInteraction) {
  // Verification
  if (
    interaction instanceof ButtonInteraction &&
    interaction.customId === "verification_btn"
  ) {
    await hlpVerify(interaction);
    return;
  }

  // Role application request
  if (
    interaction instanceof ModalSubmitInteraction &&
    (interaction.customId === "application_request_dif" ||
      interaction.customId === "application_request_vip" ||
      interaction.customId === "application_request_mod" ||
      interaction.customId === "application_request_hlp")
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await hlpApplicationRequest(interaction);
    return;
  }

  // Public role selector
  if (
    interaction instanceof StringSelectMenuInteraction &&
    interaction.customId === "public_role_selector"
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await hlpRoleSelector(interaction);
    return;
  }

  // Command processing
  if (!(interaction instanceof ChatInputCommandInteraction)) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await execute(interaction);
}
