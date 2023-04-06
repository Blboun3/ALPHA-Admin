const { Events } = require('discord.js');
const info = require('../utils/info');
var cron = require('node-cron');
const logger = require('../utils/logger');
const get_database = require('../utils/get_database');
const { version, version_name } = require('../package.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		// Inform user that bot has started
		logger.info(`Ready! Logged in as ${client.user.tag}`);
		// Setup cron task for info
		cron.schedule('30,0 * * * *', () => {info.execute(client)});
		// Get database(s) and stoe their object on client 
		client.DB = get_database.execute();
		// Load configs into the Client object
		client.config = Object.assign(require('../config.json'),require('../public_config.json'));
		// Also add logger
		client.logger = logger;
		// Store verision info
		client.version = version;
		client.version_name = version_name;
	},
};