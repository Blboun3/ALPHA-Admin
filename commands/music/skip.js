module.exports = {
    name: 'skip',
    aliases: ['sk', 'fs'],
    description: "Přeskočí aktuálně hrající skladbu",
    guildOnly: true, // spustitelný pouze na serveru

    execute(message,args,DB,client) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Nejsi v žádném hlasovém kanálu!`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Nejsi ve stejném hlasovém kanálu jako já!`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aktuálně nic nehraje!`);

        const success = client.player.skip(message);

        if (success) message.channel.send(`${client.emotes.success} - Aktuální skladba byla **přeskočena** !`);
    },
};