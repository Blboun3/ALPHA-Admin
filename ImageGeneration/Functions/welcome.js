const Canvas = require('canvas');
const Discord = require('discord.js'); // DiscordJS

module.exports = execute;

async function execute(ProfileImg, ProfileTag, channel, client, ProfileId){
	const canvas = Canvas.createCanvas(700, 250); // Vytovření canvasu
	const context = canvas.getContext('2d'); // 2D canvas

	const background = await Canvas.loadImage(`${__basedir}/ImageGeneration/Images/wallpaper.png`); // Obrázek
	context.drawImage(background, 0, 0, canvas.width, canvas.height); // Nakreslní obrázku

	context.strokeStyle = '#74037b'; // Barva
	context.strokeRect(0, 0, canvas.width, canvas.height); // Čtverec 1

	context.font = '28px sans-serif';
	context.fillStyle = '#ffffff';
	context.fillText(`Vítej na ALPHĚ,`, canvas.width / 2.5, canvas.height / 3.5);

	context.font = applyText(canvas, `${ProfileTag}!`);
	context.fillStyle = '#ffffff';
	context.fillText(`${ProfileTag}!`, canvas.width / 2.5, canvas.height / 1.8);

	context.beginPath();
	context.arc(125, 125, 100, 0, Math.PI * 2, true);
	context.closePath();
	context.clip();

	const avatar = await Canvas.loadImage(ProfileImg);
	context.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Vítej na ALPHĚ <@!${ProfileId}> - největším českém matematicko-programátorském serveru!`, attachment);
}

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return ctx.font;
};