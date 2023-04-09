import { ChannelType, Message } from "discord.js";
import config from "../utils/config";
import { CountingError } from "../utils/errors";

const { verificationChannelId, clientId, countingChannelId } = config;

function count(lastMessage: bigint, secondLastMessage: bigint) {
  return lastMessage + secondLastMessage || BigInt(1);
}

function isWrong(message: Message) {
  const emoji = message.reactions.cache.get("🚫");

  return emoji !== undefined;
}

function expect(firstMsg: Message, secondMsg: Message) {
  const firstWrong = isWrong(firstMsg);
  const secondWrong = isWrong(secondMsg);

  const first = firstWrong
    ? BigInt(0)
    : BigInt(firstMsg.content.replace(/\D/g, ""));
  const second = firstWrong
    ? BigInt(0)
    : secondWrong
    ? BigInt(0)
    : BigInt(secondMsg.content.replace(/\D/g, ""));

  return count(first, second).toString();
}

export default async function messageCreate(message: Message) {
  // Get channel in which message was sent
  const chnl = message.channel;

  // Check if channel is announcements channel (automatically post all announcements)
  if (chnl.type === ChannelType.GuildAnnouncement) {
    await message.crosspost();
  }

  // Delete message if it is in verification channel
  if (chnl.id === verificationChannelId && message.author.id !== clientId) {
    await message.delete();
    return;
  }

  // Channel with counting
  if (chnl.id === countingChannelId) {
    if (message.author.bot) return;
    // Load last 3 messages
    const msgs = await chnl.messages.fetch({ limit: 3 });
    const arr = [...msgs.values()];

    const firstMsg = arr[1];
    const secondMsg = arr[2];

    if (firstMsg === undefined || secondMsg === undefined) {
      throw new CountingError();
    }

    // Make sure that user didn't write last number too
    if (firstMsg.author.id === message.author.id) {
      await message.delete();
      return;
    }

    const expected = expect(firstMsg, secondMsg);

    if (message.content.replace(/\D/g, "") !== expected) {
      await message.reply(
        `Upss, <@${message.author.id}>, vypadá to, že jsi to pokazil!\nJedeme od začátku - první číslo je 1.`
      );
      await message.react("🚫");
      return;
    }

    await message.react("✅");
  }
}
