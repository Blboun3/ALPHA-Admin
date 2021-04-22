module.exports = {
    name: 'server',
    aliases: ["info", "srv"],
    cooldown: 10,
    description: 'Vypíše informace o aktuálním serveru',
    execute(message) {
        message.channel.send(`**Jméno:** ${message.guild.name}\n**Celkem členů:** ${message.guild.memberCount}`);
    },
};