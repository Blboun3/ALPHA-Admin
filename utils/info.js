const { guildId } = require("../config.json");
const { people_display_channel, age_display_channel } = require('../public_config.json');

module.exports = {
    name: "info",
    async execute(client) {
        var data = {
            age: 0,
            people: 0
        }

        const guild = await client.guilds.fetch(guildId);
        const now = new Date();
        const createdAt = guild.createdAt;
        data.age = parseInt((now - createdAt) / (1000 * 60 * 60 * 24));
        data.people = guild.approximateMemberCount;

        const age_channel = await guild.channels.fetch(age_display_channel);
        const people_channel = await guild.channels.fetch(people_display_channel);

        age_channel.setName(`Age: ${data.age} days`);
        people_channel.setName(`Members: ${data.people}`);

        return data;
    },
};