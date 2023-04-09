import logger from "../utils/logger";
import { EmbedBuilder, ModalSubmitInteraction, TextChannel } from "discord.js";
import config from "../utils/config";
import { memberId } from "../utils/type";
import {
  InvalidChannelTypeError,
  RoleNotFoundError,
  UnableToSendApplicationRequestError,
} from "../utils/errors";

export default async function hlpApplicationRequest(
  interaction: ModalSubmitInteraction
) {
  // Try processing the request
  const role = interaction.customId.split("_")[2];
  if (role === undefined) {
    throw new RoleNotFoundError("undefined");
  }
  // Pre-create embed
  const embed = new EmbedBuilder()
    .setColor("#B35609")
    .setTitle(`Žádost o roli ${role}`)
    .setTimestamp()
    .setFooter({ text: config.generalFooter });

  // Different embed descriptions depending on request type
  if (interaction.customId === "application_request_dif") {
    embed.setDescription(
      `Uživatel podal žádost o roli.\n\n**Jméno:**${interaction.fields.getTextInputValue(
        "applicant_name"
      )}\`\n**Uživatel:** <@${
        interaction.user.id
      }>\n**Vlastní role:** \`\`\`${interaction.fields.getTextInputValue(
        "applicant_cust_role"
      )}\`\`\`\n**Důvody proč mu roli udělit:** \`\`\`${interaction.fields.getTextInputValue(
        "applicant_reasons"
      )}\`\`\`\n**Jeho zájmy na tomto serveru:** \`${interaction.fields.getTextInputValue(
        "applicant_focuses"
      )}\``
    );
  } else if (
    interaction.customId === "application_request_mod" ||
    interaction.customId === "application_request_vip"
  ) {
    embed.setDescription(
      `Uživatel podal žádost o roli.\n\n**Jméno:**\`${interaction.fields.getTextInputValue(
        "applicant_name"
      )}\`\n**Uživatel:** <@${
        interaction.user.id
      }>\n**Důvody proč mu roli udělit:** \`\`\`${interaction.fields.getTextInputValue(
        "applicant_reasons"
      )}\`\`\`\n**Jeho zájmy na tomto serveru:** \`\`\`${interaction.fields.getTextInputValue(
        "applicant_focuses"
      )}\`\`\``
    );
  } else {
    embed.setDescription(
      `Uživatel podal žádost o roli.\n\n**Jméno:**\`${interaction.fields.getTextInputValue(
        "applicant_name"
      )}\`\n**Uživatel:** <@${
        interaction.user.id
      }>\n**Kategorie:**\`\`\`${interaction.fields.getTextInputValue(
        "applicant_role_select"
      )}\`\`\`\n**Důvody proč mu roli udělit:** \`\`\`${interaction.fields.getTextInputValue(
        "applicant_reasons"
      )}\`\`\`\n**Jeho zájmy na tomto serveru:** \`\`\`${interaction.fields.getTextInputValue(
        "applicant_focuses"
      )}\`\`\``
    );
  }

  // Get channel where to send request
  const chnl = interaction.guild?.channels.cache.get(
    config.applicationRequestsId
  );

  if (!(chnl instanceof TextChannel)) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    throw new InvalidChannelTypeError(
      "TextChannel",
      chnl ? typeof chnl.toString() : "undefined",
      config.applicationRequestsId
    );
  }

  try {
    await chnl.send({ embeds: [embed] });
  } catch {
    // Error handling
    await interaction.reply({
      content:
        "Vaši žádost se bohužel nepodařilo odeslat, zkuste to prosím později.\nDěkujeme vám za zájem!",
      ephemeral: true,
    });
    throw new UnableToSendApplicationRequestError(role, interaction.user.id);
  }

  // If everything went ok => respond with ok ( XD )
  logger.info(
    `Role application by user ${memberId(
      interaction.member
    )} was sent successfuly`
  );
  await interaction.reply({
    content: "Vaše žádost byla úspěšně odeslána.\nDěkujeme vám za zájem!",
    ephemeral: true,
  });
}
