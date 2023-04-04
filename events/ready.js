const { Events } = require('discord.js');
const info = require('../utils/info');
var cron = require('node-cron');
const logger = require('../utils/logger');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		// Inform user that bot has started
		logger.info(`Ready! Logged in as ${client.user.tag}`);
		// Setup cron task for info
		cron.schedule('30,0 * * * *', () => {info.execute(client)});
	},
};