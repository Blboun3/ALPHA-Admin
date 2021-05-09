module.exports = {
    name: 'volume',
    description: "Změní hlasitost",
    aliases: ["vol"],
    utilisation: '[volume 1-100]',

    execute(message,args,DB,client) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Nejsi v žádném hlasovém kanálu!`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Nejsi ve stejném hlasovém kanálu jako já!`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aktuálně nic nehraje!`);

        if (!args[0] || isNaN(args[0]) || args[0] === 'Infinity') return message.channel.send(`${client.emotes.error} - Musíš napsat exsistující číslo!`);

        if (Math.round(parseInt(args[0])) < 1 || Math.round(parseInt(args[0])) > 100) return message.channel.send(`${client.emotes.error} - Napiš exsistující číslo (mezi 1 a 100)!`);

        const success = client.player.setVolume(message, parseInt(args[0]));

        if (success) message.channel.send(`${client.emotes.success} - Hlasitost nastavena na **${parseInt(args[0])}%** !`);
    },
};