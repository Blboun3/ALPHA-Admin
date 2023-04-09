import { ChannelType, Client, TextChannel } from "discord.js";
import config from "./config";
import logger from "./logger";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const { ticketChannelId, adminId, guildId, modId } = config;

// Function to create new ticket with user
export async function createTicket(
  user: string,
  displayName: string,
  client: Client
): Promise<boolean> {
  // Get guild and channel
  const guild = await client.guilds.fetch(guildId);
  const ticketChannel = await guild.channels.fetch(ticketChannelId);

  if (ticketChannel === null) {
    const child = logger.child({ ticketChannelId });
    child.error(`Ticket channel not found.`);
    return false;
  }

  if (!(ticketChannel instanceof TextChannel)) {
    const child = logger.child({ ticketChannelId });
    child.error(`Ticket channel is not a text channel.`);
    return false;
  }

  const thread = await ticketChannel.threads.create({
    name: displayName,
    autoArchiveDuration: 60,
    type: ChannelType.PrivateThread,
    invitable: false,
  });

  // Add people
  // Add user
  await thread.members.add(user);
  // Add admins

  const admin = await guild.roles.fetch(adminId);
  if (admin === null) {
    const child = logger.child({ adminId });
    child.error(`Admin role not found.`);
    return false;
  }

  const mod = await guild.roles.fetch(modId);
  if (mod === null) {
    const child = logger.child({ modId });
    child.error(`Mod role not found.`);
    return false;
  }

  for (const member of admin.members.values()) {
    await thread.members.add(member);
  }

  for (const member of mod.members.values()) {
    await thread.members.add(member);
  }

  // Save all to DB
  try {
    const ticket = await prisma.ticket.create({
      data: {
        memberId: user,
        channelId: thread.id,
        channelName: displayName,
      },
    });

    logger.info(`Created ticket ${ticket.id}`);

    await thread.edit({
      reason: `Ticket ${ticket.id}`,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const child = logger.child({ error: error });
      child.error("An error occured while saving to DB.");
      return false;
    }
  }
  return true;
}

// Function to close ticket (i.e. lock and archive thread)
export async function closeTicket(id: string, client: Client) {
  // Get ticket ID
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: id,
    },
  });
  if (ticket === null) {
    logger.error(`Cannot find ticket with id ${id}`);
    return -1;
  }
  const ticketID = ticket.channelId;
  // Get guild and channel
  const guild = await client.guilds.fetch(guildId);
  const ticketChannel = await guild.channels.fetch(ticketChannelId);

  if (ticketChannel === null || !(ticketChannel instanceof TextChannel)) {
    const child = logger.child({ ticketChannelId });
    child.error(`Ticket channel not found.`);
    return -1;
  }
  // Try to fetch the thread
  try {
    const thread = await ticketChannel.threads.fetch(ticketID);
    if (thread === null) {
      logger.error(`Cannot find thread with id ${ticketID}`);
      return -1;
    }
    try {
      await thread.setLocked(true);
      await thread.setArchived(true);
      await prisma.ticket.update({
        where: {
          id: id,
        },
        data: {
          open: false,
        },
      });
    } catch (error) {
      const child = logger.child({ error });
      child.error("An error occured");
      return 0;
    }
    return 1;
  } catch (error) {
    const childs = logger.child({ error: error });
    childs.error("An error occured while fetching thread.");
    return -2;
  }
}
