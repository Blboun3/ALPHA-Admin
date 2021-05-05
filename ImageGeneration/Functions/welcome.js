const Canvas = require('canvas');
const Discord = require('discord.js'); // DiscordJS

module.exports = execute;

async function execute(ProfileImg, ProfileTag, channel, client){
	/*
	Vytvoření canvasu
	*/
	const canvas = Canvas.createCanvas(700,250); // 2D canvas
	const ctx = canvas.getContext('2d');
	/*
	Načtení obrázků
	*/
	const background = await Canvas.loadImage("/home/cyril/Documents/ALPHA-Admin/ALPHA-Admin/ImageGeneration/Images/backgroundImage.png"); // Načtení pozadí
	let x, y = 0; // pozice [0,0]
	ctx.drawImage(background, 0, 0); // Nakreslení obrázku
	const pfp = await Canvas.loadImage(ProfileImg); // member.user.displayAvatarURL({format: 'png'});
	x = canvas.width / 2 - pfp.width / 2; // Nastavení pozice X
	y = 25;//canvas.height / 2 - pfp.height / 2; // Nastavení pozice Y
	ctx.drawImage(pfp, x, y); // Nakreslení profilovky
	/*
	Napsání textu
	*/
	ctx.fillStyle = "#ffffff"; // White text
	ctx.font = '35px sans-serif'; // Nastavení fontu
	let text = `Vítej ${ProfileTag}` // member.user.tag
	x = canvas.width / 2 - ctx.measureText(text).width / 2; // X pozice
	ctx.fillText(text, x, 60 + pfp.height); // Napsání textu

	ctx.font = '30px sans-serif'; // Nastavení fontu
	text = "na ALPHě!"; // Text
	x = canvas.width / 2 - ctx.measureText(text).width / 2;// X pozice
	ctx.fillText(text, x, 100 + pfp.height); // Vypsání textu

    const attachment = new Discord.MessageAttachment(canvas.toBuffer());
	await channel.send("", attachment); // Odeslání
}