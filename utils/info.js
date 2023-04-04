const { guildId } = require("../config.json");
const { people_display_channel, age_display_channel } = require('../public_config.json');
const logger = require('../utils/logger');

module.exports = {
    name: "info",
    async execute(client) {
        // Prepare object for data storing
        var data = {
            age: 0,
            people: 0
        }
        // Get guild, it must be fetched for .createdAt to work
        const guild = await client.guilds.fetch(guildId);
        if (guild == undefined) {
            logger.error(`Guild ${guildId} not found. (info)`);
            return;
        }

        // Calculate server age in days
        const now = new Date();
        const createdAt = guild.createdAt;
        data.age = ((now - createdAt) / (1000 * 60 * 60 * 24)) | 0;
        // Get count of people on the server
        data.people = guild.memberCount;

        try {
            // Get channels to rename to work as information
            const age_channel = await guild.channels.fetch(age_display_channel);
            const people_channel = await guild.channels.fetch(people_display_channel);

            // Set channels's names to show data
            age_channel.setName(`Age: ${data.age} days`);
            people_channel.setName(`Members: ${data.people}`);
        } catch (error) {
            const child = logger.child({error: error.toString()})
            child.error(`An error occured during regular info work.`)
            return;
        }

        const child = logger.child({data: data});
        child.info("Regular info work happened.")
        return data;
    },
};