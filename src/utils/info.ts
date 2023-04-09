import { Client } from "discord.js";
import logger from "./logger";
import config from "./config";

export default async function info(client: Client) {
  const { guildId, peopleDisplayChannelId, ageDisplayChannelId } = config;

  // Get guild, it must be fetched for .createdAt to work
  const guild = await client.guilds.fetch(guildId);

  /*
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (guild === undefined) {
    logger.error(
      `FAKT SUTPIDO NEMA SE DIT TOHLE!!!! Guild ${guildId} not found. (info)`
    );
    return;
  }
  */

  // Calculate server age in days
  const now: Date = new Date();
  const createdAt: Date = guild.createdAt;
  const age = Math.trunc(
    (now.getMilliseconds() - createdAt.getMilliseconds()) /
      (1000 * 60 * 60 * 24)
  );
  // Get count of people on the server
  const people = guild.memberCount;

  try {
    // Get channels to rename to work as information
    const ageChannel = await guild.channels.fetch(ageDisplayChannelId);
    const peopleChannel = await guild.channels.fetch(peopleDisplayChannelId);

    if (ageChannel === null) {
      const child = logger.child({ ageDisplayChannelId });
      child.error(`Age display channel not found.`);
      return;
    }

    if (peopleChannel === null) {
      const child = logger.child({ peopleDisplayChannelId });
      child.error(`People display channel not found.`);
      return;
    }

    // Set channels's names to show data
    await ageChannel.setName(`Age: ${age} days`);
    await peopleChannel.setName(`Members: ${people}`);
  } catch (error) {
    const child = logger.child({ error: error });
    child.error(`An error occured during regular info work.`);
    return;
  }
  const data = {
    age,
    people,
  };
  const child = logger.child({ data });
  child.info("Regular info work happened.");
  return data;
}
