const { Events } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
	name: Events.Warn,
	once: false,
	execute(m) {
		logger.warn(m)
	},
};