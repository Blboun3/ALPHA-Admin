module.exports = {
    name: 'nowplaying',
    description: "Zobrazí informace o aktuálně hrající skladbě",
    aliases: ['np'],
    guildOnly: true, // spustitelný pouze na serveru
    execute(message,args,DB,client) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Nejsi v žádném hlasovém kanálu!`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Nejsi ve stejném hlasovém kanálu jako já!`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aktuálně nic nehraje!`);

        const track = client.player.nowPlaying(message);
        const filters = [];

        Object.keys(client.player.getQueue(message).filters).forEach((filterName) => client.player.getQueue(message).filters[filterName]) ? filters.push(filterName) : false;

        message.channel.send({
            embed: {
                color: 'RED',
                author: { name: track.title },
                fields: [
                    { name: 'Kanál', value: track.author, inline: true },
                    { name: 'Skladbu pustil', value: track.requestedBy.username, inline: true },
                    { name: 'Z playlistu', value: track.fromPlaylist ? 'Ano' : 'Ne', inline: true },

                    { name: 'Views', value: track.views, inline: true },
                    { name: 'Trvání', value: track.duration, inline: true },
                    { name: 'Aktivní filtry', value: filters.length + '/' + client.filters.length, inline: true },

                    { name: 'Hlasitost', value: client.player.getQueue(message).volume, inline: true },
                    { name: 'Opakuje se ?', value: client.player.getQueue(message).repeatMode ? 'Ano' : 'Ne', inline: true },
                    { name: 'Pozastavená ?', value: client.player.getQueue(message).paused ? 'Ano' : 'Ne', inline: true },

                    { name: 'Progress:', value: client.player.createProgressBar(message, { timecodes: true }), inline: true }
                ],
                thumbnail: { url: track.thumbnail },
                timestamp: new Date(),
            },
        });
    },
};