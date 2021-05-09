module.exports = {
    name: 'play',
    description: "Pustí nějakou skladbu",
    aliases: ['p'],
    usage: '[name/url]',
    guildOnly: true,
    timeout: 5,
    execute(message,args,DB,client) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Nejsi v žádném hlasovém kanálu!`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Nejsi ve stejném hlasovém kanálu jako já!`);

        if (!args[0]) return message.channel.send(`${client.emotes.error} - Musíš mi nějak sdělit, co mám hrát!`);

        client.player.play(message, args.join(" "), { firstResult: true });
    },
};