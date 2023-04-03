const { Events } = require('discord.js');
const info = require('../utils/info');
var cron = require('node-cron');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		info.execute(client);
		cron.schedule('30,0 * * * *', () => {info.execute(client)});
	},
};