module.exports = {
    name: 'pause',
    aliases: ["mmnt"],
    description:"Pozastaví aktuálně hrající skladbu",
    execute(message,args,DB,client) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Nejsi v žádném hlasovém kanálu !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Nejsi ve stejném hlasovém kanálu jako já!`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aktuálně nehraje žádná hudba!`);

        if (client.player.getQueue(message).paused) return message.channel.send(`${client.emotes.error} - Hudba je již pausnutá!`);

        const success = client.player.pause(message);

        if (success) message.channel.send(`${client.emotes.success} - Skladba '${client.player.getQueue(message).playing.title}' byla pozastavena!`);
    },
};