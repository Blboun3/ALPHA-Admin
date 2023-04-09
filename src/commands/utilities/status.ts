import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
} from "discord.js";
import os from "node:os";
import config from "../../utils/config";
import packageJson from "../../utils/package-json";

// Function that converts bytes into more human friendly units, used for showing how much RAM does system have
function convertBytes(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) {
    return "n/a";
  }
  const i = Number.parseInt(
    Math.floor(Math.log(bytes) / Math.log(1024)).toString()
  );
  if (i === 0) {
    return `${bytes.toString()} ${sizes[i] ?? ""}`;
  }
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i] ?? ""}`;
}

// Function to convert time in seconds to DD:HH:MM:SS
function secondsToTime(seconds: string) {
  const dateOBJ = new Date(Number.parseInt(seconds) * 1000);
  const hours = dateOBJ.getUTCHours().toString().padStart(2, "0");
  const minutes = dateOBJ.getUTCMinutes().toString().padStart(2, "0");
  const sec = dateOBJ.getUTCSeconds().toString().padStart(2, "0");
  const days = (dateOBJ.getUTCDate() - 1).toString(); // It returns date since 1.1.1970, technically with uptime > month this would become problematic...
  return days === "0"
    ? `${hours}:${minutes}:${sec}`
    : `${days} days, ${hours}:${minutes}:${sec}`;
}

export default {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Replies with current status of the bot.")
    .addBooleanOption((option) =>
      option
        .setName("public")
        .setDescription(
          "If the output of this command should be displayed publicly or not"
        )
        .setRequired(false)
    )
    .setDMPermission(true)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  async execute(interaction: ChatInputCommandInteraction) {
    // Object holding all system info
    const info = {
      cpuArch: os.machine(),
      cpuCount: os.cpus().length,
      cpuModel: os.cpus()[0]?.model ?? "Unknown",
      osType: os.type(),
      osVersion: os.release(),
      osMemory: convertBytes(os.totalmem()),
      uptime: secondsToTime(os.uptime().toString()),
      ping: interaction.client.ws.ping,
    };
    // Building embed to send
    const embed = new EmbedBuilder()
      .setColor(0x1e_ec_d4)
      .setTitle("ALPHA Admin bot status")
      .setDescription("I am clearly alive and well!")
      .setAuthor({
        name: "ALPHA",
        iconURL:
          "https://cdn.discordapp.com/avatars/797862942036721664/ffc64d41e14d5d913c8a543dc4024cef.webp",
        url: "https://github.com/Blboun3/ALPHA-Admin",
      })
      .setThumbnail("https://img.icons8.com/neon/256/ok.png")
      .setTimestamp()
      .setFooter({ text: config.generalFooter })
      .addFields(
        {
          name: "Software info",
          value: `Running on (OS): \`${info.osType}\` version (kernel): \`${info.osVersion}\`\nSystem uptime: \`${info.uptime}\``,
          inline: true,
        },
        {
          name: "Hardware info",
          value: `CPU Model: \`${info.cpuModel}\`\nCPU Architecture: \`${info.cpuArch}\`\nLogical CPUs: \`${info.cpuCount}\`\nTotal system memory: \`${info.osMemory}\``,
          inline: true,
        },
        {
          name: "Bot info",
          value: `Ping: \`${info.ping}ms\`\nVersion: \`${packageJson.version}\`\nVersion name: \`${packageJson.versionName}\`\nGithub: [https://github.com/Blboun3/ALPHA-Admin](https://github.com/Blboun3/ALPHA-Admin)`,
        }
      );

    // Send private or public response depenending on user's choice
    const ephe = interaction.options.getBoolean("public");
    await interaction.reply({ embeds: [embed], ephemeral: !ephe });
  },
};
