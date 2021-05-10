module.exports = {
    name: 'w-filters',
    aliases: ['filters'],
    description: "Zobrazí exsistující filtry",

    execute(message,args,DB,client) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Nejsi v žádném hlasovém kanálu!`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Nejsi ve stejném hlasovém kanálu jako já!`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aktuálně nic nehraje!`);

        const filtersStatuses = [[], []];

        client.filters.forEach((filterName) => {
            const array = filtersStatuses[0].length > filtersStatuses[1].length ? filtersStatuses[1] : filtersStatuses[0];
            array.push(filterName.charAt(0).toUpperCase() + filterName.slice(1) + " : " + (client.player.getQueue(message).filters[filterName] ? client.emotes.success : client.emotes.off));
        });

        message.channel.send({
            embed: {
                color: 'ORANGE',
                fields: [
                    { name: 'Filtry', value: filtersStatuses[0].join('\n'), inline: true },
                    { name: '** **', value: filtersStatuses[1].join('\n'), inline: true },
                ],
                timestamp: new Date(),
                description: `Seznam všech filtrů\nPoužij \`!filter\` pro přidání filtru!`,
            },
        });
    },
};