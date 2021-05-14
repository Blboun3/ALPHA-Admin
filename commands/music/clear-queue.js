module.exports = {
    name: 'clear-queue',
    description:"Smaže všechny skladby z fronty",
    aliases: ['cq'],
    guildOnly: true, // spustitelný pouze na serveru

    execute(message,args,DB,client) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Nejsi v žádném hlasovém kanálu!`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Nejsi ve stejném hlasovém kanálu jako já!`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aktuálně nic nehraje!`);

        if (client.player.getQueue(message).tracks.length <= 1) return message.channel.send(`${client.emotes.error} - Ve frontě je pouze jedna skladba`);

        client.player.clearQueue(message);

        message.channel.send(`${client.emotes.success} - Fronta byla **odstraněna**!`);
    },
};