const { guildId } = require("../config.json");
const { people_display_channel, age_display_channel } = require('../public_config.json');

module.exports = {
    name: "info",
    async execute(client) {
        // Prepare object for data storing
        var data = {
            age: 0,
            people: 0
        }
        
        // Get guild
        const guild = await client.guilds.fetch(guildId);
        // Calculate server age in days
        const now = new Date();
        const createdAt = guild.createdAt;
        data.age = parseInt((now - createdAt) / (1000 * 60 * 60 * 24));
        // Get approximate count of people on the server
        data.people = guild.approximateMemberCount;

        // Get channels to rename to work as information
        const age_channel = await guild.channels.fetch(age_display_channel);
        const people_channel = await guild.channels.fetch(people_display_channel);

        // Set channels's names to show data
        age_channel.setName(`Age: ${data.age} days`);
        people_channel.setName(`Members: ${data.people}`);

        // Log data as log that this function ran
        console.log(data)

        return data;
    },
};