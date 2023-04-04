/*
ALPHA Admin Discord Bot
Autor: Blboun3
*/

// Import libraries
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const logger = require('./utils/logger');


// Create a new bot
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent] });

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
			logger.info(`The command at ${filePath} was loaded successfully.`);
		} else {
			logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Process all events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		logger.info(`Loaded event at ${filePath}, event is of type 'once'.`)
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		logger.info(`Loaded event at ${filePath}, event is of type 'on'.`)
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log bot to discord with token
client.login(token);