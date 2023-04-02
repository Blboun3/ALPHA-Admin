const {Events} = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Get channel in which message was sent
        const chnl = message.channel;

        // Check if channel is announcements channel
        if(chnl.type === 5){
            message.crosspost();
        }
    },
}