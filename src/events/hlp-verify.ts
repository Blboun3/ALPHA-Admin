import { Canvas, createCanvas, loadImage } from "@napi-rs/canvas";
import { TextChannel, AttachmentBuilder, ButtonInteraction } from "discord.js";
import logger from "../utils/logger";
import { GlobalFonts } from "@napi-rs/canvas";
import config from "../utils/config";
import {
  InvalidChannelTypeError,
  SomethingFuckedUpError,
} from "../utils/errors";

// Pass the entire Canvas object because you'll need access to its width and context
function applyText(canvas: Canvas, text: string) {
  const context = canvas.getContext("2d");

  // Declare a base size of the font
  let fontSize = 70;

  do {
    // Assign the font to the context and decrement it so it can be measured again
    context.font = `${(fontSize -= 2)}px JetBrainsMono`;
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (context.measureText(text).width > canvas.width - 320);

  // Return the result to use in the actual canvas
  return context.font;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function hlpVerify(interaction: ButtonInteraction<any>) {
  // Give user verified role
  await interaction.member.roles.add(config.verifiedRoleId);

  logger.info(`User ${interaction.member.id} was verified`);
  // Get welcome channel (where to send message about his appearance)
  const chnl = interaction.guild.channels.cache.get(config.welcomeChannelId);

  if (!(chnl instanceof TextChannel)) {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    throw new InvalidChannelTypeError(
      "TextChannel",
      chnl ? typeof chnl.toString() : "undefined",
      config.welcomeChannelId
    );
  }

  // Process Image creation
  GlobalFonts.registerFromPath("./assets/font.ttf", "JetBrainsMono");
  const canvas = createCanvas(700, 250);
  const context = canvas.getContext("2d");

  // Draw background image
  const bg = await loadImage("./assets/welcome_background.jpg");
  context.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Draw stroke around entire image
  context.strokeStyle = "#0099ff";
  context.strokeRect(0, 0, canvas.width, canvas.height);

  // Assign the decided font to the canvas
  context.font = applyText(canvas, interaction.member.displayName);
  context.fillStyle = "#ffffff";
  context.fillText(
    `${interaction.member.displayName}!`,
    canvas.width / 2.5,
    canvas.height / 1.5
  );
  // Slightly smaller text placed above the member's display name
  context.font = "28px JetBrainsMono";
  context.fillStyle = "#ffffff";
  context.fillText("Vítej na ALPHĚ,", canvas.width / 2.5, canvas.height / 2.5);

  // Process User's avatar
  const url = interaction.user.displayAvatarURL({ extension: "jpg" });

  const body = await fetch(url);

  const avatar = await loadImage(await body.arrayBuffer());
  // Cut it to circle
  // Pick up the pen
  context.beginPath();
  // Start the arc to form a circle
  context.arc(125, 125, 100, 0, Math.PI * 2, true);
  // Put the pen down
  context.closePath();
  // Clip off the region you drew on
  context.clip();
  // Place avatar on to the background
  context.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new AttachmentBuilder(await canvas.encode("png"), {
    name: `welcome-user.png`,
  });

  try {
    await chnl.send({
      content: `Vítej na ALPHĚ, <@${interaction.user.id}> - největším českém matematicko-programátorském serveru!`,
      files: [attachment],
    });
  } catch {
    throw new SomethingFuckedUpError(
      `unable to send welcome message for user ${interaction.user.id}`
    );
  }

  // Reply to user that verification was successfull (also so that discord doesn't have any problems XD)
  await interaction.reply({
    content: "Verifikace proběhla úspěšně!",
    ephemeral: true,
  });
}
