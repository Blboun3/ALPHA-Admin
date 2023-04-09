import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} from "discord.js";
import config from "../../utils/config";
import ms from "ms";

export default {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Sends informations about specified user.")
    .setDMPermission(true)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User that you want to get info about.")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

  async execute(interaction: ChatInputCommandInteraction) {
    const usr = interaction.options.getUser("user") ?? interaction.user;
    const info = {
      username: usr.username,
      discriminator: usr.discriminator,
      id: usr.id,
      pfp: usr.avatarURL(),
      createdAt: usr.createdAt.toUTCString(),
      age: ms(Date.now() - usr.createdAt.getTime(), { long: true }),
    };

    const embed = new EmbedBuilder()
      .setTitle(`\`${info.username}#${info.discriminator}\` info`)
      .setDescription(
        `Username: \`${info.username}\`\nDiscriminator: \`${
          info.discriminator
        }\`\nID: \`${info.id}\`\nAccount created at: \`${
          info.createdAt
        }\`\nPFP link: [${info.pfp ?? "unknown"}](${
          info.pfp ?? "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        })`
      )
      .setThumbnail(info.pfp)
      .setTimestamp()
      .setColor("#EFAD7B")
      .setFooter({ text: config.generalFooter });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
