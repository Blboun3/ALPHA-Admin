/*
ALPHA Admin Discord Bot
Autor: Blboun3
*/

// Import libraries
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
// Create a new bot
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Collection of commands
client.commands = new Collection();

// Load all commands from 'commands' folder and it's subfolders
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			console.log(`[INFO] The command at ${filePath} was loaded successfully.`);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// If interaction and is command
client.on(Events.InteractionCreate, async interaction => {
	if (!(interaction.isChatInputCommand() || interaction.isModalSubmit())) return;
	//console.log(interaction);

	// Modal submit => role application request
	if(interaction.isModalSubmit()){
		// If it isn't application_request
		if(!(interaction.customId === 'application_request_dif' || interaction.customId === 'application_request_vip' || interaction.customId === 'application_request_mod')) return;
		try {
			const embed = new EmbedBuilder()
			.setColor('#B35609')
			.setTitle(`Žádost o roli ${interaction.customId.split('_')[2]}`)
			.setTimestamp()
            .setFooter({text: 'ALPHA Admin bot by Blboun3#0084'})

		if(interaction.customId === 'application_request_dif'){
			embed.setDescription(`Uživatel podal žádost o roli.\n\n**Jméno:**${interaction.fields.getTextInputValue('applicant_name')}\`\n**Uživatel:** <@${interaction.user.id}>\n**Vlastní role:** \`\`\`${interaction.fields.getTextInputValue('applicant_cust_role')}\`\`\`\n**Důvody proč mu roli udělit:** \`\`\`${interaction.fields.getTextInputValue('applicant_reasons')}\`\`\`\n**Jeho zájmy na tomto serveru:** \`${interaction.fields.getTextInputValue('applicant_focuses')}\``)
		} else {
			embed.setDescription(`Uživatel podal žádost o roli.\n\n**Jméno:**\`${interaction.fields.getTextInputValue('applicant_name')}\`\n**Uživatel:** <@${interaction.user.id}>\n**Důvody proč mu roli udělit:** \`\`\`${interaction.fields.getTextInputValue('applicant_reasons')}\`\`\`\n**Jeho zájmy na tomto serveru:** \`\`\`${interaction.fields.getTextInputValue('applicant_focuses')}\`\`\``)
		}
		interaction.guild.channels.cache.get('1090719329546424450').send({embeds: [embed]})
		} catch (error) {
			await interaction.reply({content: "Vaši žádost se bohužel nepodařilo odeslat, zkuste to prosím později.\nDěkujeme vám za zájem!", ephemeral: true})
			return;
		}
		await interaction.reply({content: "Vaše žádost byla úspěšně odeslána.\nDěkujeme vám za zájem!", ephemeral: true})
	}

    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log bot to discord with token
client.login(token);
