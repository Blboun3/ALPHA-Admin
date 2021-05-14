module.exports = {
    name: 'search',
    aliases: ['sr'],
    description:"Najde skladbu",
    usage: '[name/URL]',
    guildOnly: true, // spustitelný pouze na serveru

    execute(message,args,DB,client) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Nejsi v žádném hlasovém kanálu!`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Nejsi ve stejném hlasovém kanálu jako já!`);

        if (!args[0]) return message.channel.send(`${client.emotes.error} - Musíš mi nějak sdělit, co mám hledat!`);

        client.player.play(message, args.join(" "));
    },
};