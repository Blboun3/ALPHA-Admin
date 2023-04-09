import { ChatInputCommandInteraction, TextChannel } from "discord.js";
import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
} from "discord.js";
import config from "../../utils/config";
import { GuildMember } from "discord.js";
import { CommandArgumentError } from "../../utils/errors";

export default {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Announces some message to specific channel.")
    .setDMPermission(false)
    .addChannelOption((option) =>
      option
        .setName("chnl")
        .setDescription("Channel where to announce.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Title of the announcement.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("Content for the announcement.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("hide")
        .setDescription("If announcer's identity should remain secret")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction: ChatInputCommandInteraction) {
    // Load all the data
    const chnl = interaction.options.getChannel("chnl");
    const content = interaction.options.getString("content");
    const title = interaction.options.getString("title");

    if (chnl === null || content === null || title === null) {
      throw new CommandArgumentError(
        `Invalid command argument: one argument is null.`
      );
    }

    const rawHide = interaction.options.getBoolean("hide");
    const hide = rawHide === null ? false : rawHide;

    // Build embed
    const embed = new EmbedBuilder()
      .setTitle(`${title}`)
      .setColor("#8730A6")
      .setDescription(`${content.toString().replaceAll("\\n", "\n")}`)
      .setTimestamp()
      .setFooter({ text: config.generalFooter });

    if (!hide) {
      const member = interaction.member;
      if (member === null || !(member instanceof GuildMember)) {
        throw new CommandArgumentError(
          `Invalid command argument: member is null or not an instance of GuildMember.`
        );
      }
      embed.setAuthor({
        name: member.displayName,
        iconURL: member.displayAvatarURL(),
      });
    }

    // Send embed
    try {
      if (!(chnl instanceof TextChannel)) {
        throw new CommandArgumentError(
          `Invalid command argument: chnl is not an instance of TextChannel.`
        );
      }
      await chnl.send({ embeds: [embed] });
    } catch {
      await interaction.reply(
        "Ooops, it looks like I don't have permissions to write to that channel!"
      );
      return;
    }
    // Reply that action happened
    await interaction.reply(`Your message was successfully announced!`);
  },
};
