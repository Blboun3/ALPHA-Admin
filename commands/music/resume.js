module.exports = {
    name: 'resume',
    description: "Odpausne skladbu",
    aliases: ["res"],
    execute(message,args,DB,client) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Nejsi v žádném hlasovém kanálu!`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Nejsi ve stejném hlasovém kanálu jako já!`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aktuálně nic nehraje!`);

        if (!client.player.getQueue(message).paused) return message.channel.send(`${client.emotes.error} - Hudba již hraje!`);

        const success = client.player.resume(message);

        if (success) message.channel.send(`${client.emotes.success} - Skladba ${client.player.getQueue(message).playing.title} pokračuje v přehrávání!`);
    },
};