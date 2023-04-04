const { Events } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
	name: Events.Error,
	once: false,
	execute(m) {
		logger.error(m)
	},
};