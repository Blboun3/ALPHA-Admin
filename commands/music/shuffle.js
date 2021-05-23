module.exports = {
    name: 'shuffle',
    aliases: ['sh'],
    description: "Zamíchá frontu",
    guildOnly: true, // spustitelný pouze na serveru

    execute(message,args,DB,client) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Nejsi v žádném hlasovém kanálu!`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Nejsi ve stejném hlasovém kanálu jako já!`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aktuálně nic nehraje!`);

        const success = client.player.shuffle(message);

        if (success) message.channel.send(`${client.emotes.success} - Zamícháno **${client.player.getQueue(message).tracks.length}** skladeb!`);
    },
};