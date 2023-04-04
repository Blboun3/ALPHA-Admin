const { Events } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
	name: Events.Debug,
	once: false,
	execute(m) {
		logger.debug(m)
	},
};