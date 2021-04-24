module.exports = {
    name: 'server', // Jméno	
    aliases: ["info", "srv"], // Aliasy
    cooldown: 10, // Cooldown
    description: 'Vypíše informace o aktuálním serveru', // Popis
    execute(message) { // Execution
        message.channel.send(`**Jméno:** ${message.guild.name}\n**Celkem členů:** ${message.guild.memberCount}`); // Vypsání informací
    },
};