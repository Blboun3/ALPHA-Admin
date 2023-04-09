import { APIInteractionGuildMember, GuildMember } from "discord.js";

export function memberId(
  member: GuildMember | APIInteractionGuildMember | null
) {
  if (member instanceof GuildMember) {
    return member.id;
  }

  if (member === null) {
    return "unknown";
  }

  return member.user.id;
}
