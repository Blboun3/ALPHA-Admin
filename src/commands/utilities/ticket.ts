import {
  SlashCommandBuilder,
  codeBlock,
  PermissionFlagsBits,
  inlineCode,
  ChatInputCommandInteraction,
} from "discord.js";
import table from "text-table";
import logger from "../../utils/logger";
import { closeTicket, createTicket } from "../../utils/ticket-system";
import { PrismaClient } from "@prisma/client";
import { CommandArgumentError } from "../../utils/errors";
const prisma = new PrismaClient();

export default {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("For working with tickets")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Opens a new ticket.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Add user that has access to ticket.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name of the ticke channel. Must be unique!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("close")
        .setDescription("Closes the ticket (no one except mods can see it)")
        .addStringOption((option) =>
          option
            .setName("ticket")
            .setDescription("Ticket channel to close")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("Lists all tickets from DB")
        .addBooleanOption((option) =>
          option
            .setName("public")
            .setDescription(
              "Should the output of this command be publicly visible."
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("find")
        .setDescription("Find ticket by channel name")
        .addStringOption((option) =>
          option
            .setName("channel-name")
            .setDescription("Name of the channel of the ticket")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("public")
            .setDescription(
              "Should the output of this command be publicly visible."
            )
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    // Get logger
    // Ticket create
    if (interaction.options.getSubcommand() === "create") {
      await interaction.deferReply({ ephemeral: true });
      // Load all the data
      const chnlName = interaction.options.getString("name");
      const userId = interaction.options.getUser("user")?.id;

      if (chnlName === null || userId === undefined) {
        throw new CommandArgumentError(
          `Invalid command argument: one of the options is null.`
        );
      }

      // Create ticket
      const response = await createTicket(userId, chnlName, interaction.client);
      await interaction.editReply({
        content: response
          ? `Successfully created ticket named ${chnlName} with user <@${userId}>.`
          : `Unable to create ticket named ${chnlName} with user <@${userId}> due to uknown error. Please try again later or contact administrator.`,
      });
      // Ticket list
    } else if (interaction.options.getSubcommand() === "list") {
      // Process publicity of response
      const pub = !(interaction.options.getBoolean("public") ?? false);
      await interaction.deferReply({ ephemeral: pub });

      const tickets = await prisma.ticket.findMany({
        select: {
          id: true,
          channelName: true,
          memberId: true,
          open: true,
        },
      });

      // Get all and process them to table
      const dataTable = [["Channel Name", "Member", "Open", "UUID"]];
      for (const element of tickets) {
        const thisArr = [
          element.channelName,
          element.memberId,
          element.open.toString(),
          element.id,
        ];
        dataTable.push(thisArr);
      }
      const t = table(dataTable);
      // Respond
      await interaction.editReply({
        content: `${codeBlock(t)}`,
      });

      // Ticket Close
    } else if (interaction.options.getSubcommand() === "close") {
      await interaction.deferReply({ ephemeral: true });
      // Load constants

      const tcktId = interaction.options.getString("ticket");

      if (tcktId === null) {
        throw new CommandArgumentError(
          `Invalid command argument: tcktId is null.`
        );
      }

      // Process ticket closing
      const response = await closeTicket(tcktId, interaction.client);

      logger.info(`Closed ticket. TS.CreateTicket response is ${response}`);
      // Respond so that discord isn't being annoying
      switch (response) {
        case 1: {
          await interaction.editReply({
            content: `Successfully closed ticket with UUID ${tcktId}.`,
          });
          break;
        }
        case -1: {
          await interaction.editReply({
            content: `Ticket with UUID ${tcktId} doesn't exist.`,
          });
          break;
        }
        case -2: {
          await interaction.editReply({
            content: `An unknown error occured while fetching the thread. Please try again later.`,
          });
          break;
        }
        case 0: {
          await interaction.editReply({
            content: `An unknown error happened while updating thread start. Pleas try again later.`,
          });
        }
      }
      return;

      // Ticket find
    } else if (interaction.options.getSubcommand() === "find") {
      // Process publicity of the response
      const pub = !(interaction.options.getBoolean("public") ?? true);
      await interaction.deferReply({ ephemeral: pub });
      // Load constants

      const chnlName = interaction.options.getString("channel-name");

      if (chnlName === null) {
        throw new CommandArgumentError(
          `Invalid command argument: chnlName is null.`
        );
      }

      const tickets = await prisma.ticket.findMany({
        where: {
          channelName: {
            contains: chnlName,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          memberId: true,
          channelName: true,
          open: true,
        },
      });

      // If no results found
      if (tickets.length === 0) {
        await interaction.editReply({
          content: `There are no results for: ${inlineCode(chnlName)}`,
        });
        return;
      }
      const dataTable = [["Channel Name", "Member", "Open", "UUID"]];
      for (const element of tickets) {
        const thisArr = [
          element.channelName,
          element.memberId,
          element.open.toString(),
          element.id,
        ];
        dataTable.push(thisArr);
      }
      const t = table(dataTable);
      // Reply
      await interaction.editReply({
        content: `Search query for tickets with channel name: ${inlineCode(
          chnlName
        )} ${codeBlock(t)}`,
      });
      return;
    }
  },
};
