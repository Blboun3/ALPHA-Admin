module.exports = {
    name: 'filter',
    aliases: ["f"],
    description: "Zapne nějaký filtr na zvuk, jako například bassboost, vibrato, treble.",

    execute(message,args,DB,client) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Nejsi v žádném hlasovém kanálu!`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Nejsi ve stejném hlasovém kanálu jako já!`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aktuálně nic nehraje!`);

        if (!args[0]) return message.channel.send(`${client.emotes.error} - Prosím specifikuj exsistující filtr!`);

        const filterToUpdate = client.filters.find((x) => x.toLowerCase() === args[0].toLowerCase());

        if (!filterToUpdate) return message.channel.send(`${client.emotes.error} - Tento filtr neexsistuje!`);

        const filtersUpdated = {};

        filtersUpdated[filterToUpdate] = client.player.getQueue(message).filters[filterToUpdate] ? false : true;

        client.player.setFilters(message, filtersUpdated);

        if (filtersUpdated[filterToUpdate]) message.channel.send(`${client.emotes.music} - **Přidávám** filtr na skladbu, čím delší je skladba, tím déle to potrvá`);
        else message.channel.send(`${client.emotes.music} - **Vypínám** filtr na skladbě`);
    },
};