const Discord = require('discord.js');
module.exports = {
    name: 'user-info', // Jméno
    aliases: ["me"], // Alias
    cooldown: 3, // Coldown
    description: 'Vypíše informace o daném uživateli serveru', // Popis
    execute(message, args, DB) { // Spuštění
        // Jestliže se jedná o autora
        if (!message.mentions.users.size) {
            // Vytažení z DB
            DB.query(`SELECT * FROM warns WHERE (userID = '${message.author.id}')`, (err, result) => { // Vybrání z databáze
                if (err) throw err; // Vyhození erroru
                return message.channel.send(`**Jméno:** <@${message.author.id}>\n**ID uživatele:** ${message.author.id}\n**Počet warnů:** ${result.length} \n**Odkaz na tvojí profilovku:** <${message.author.displayAvatarURL({ dynamic: true, format: 'png'})}>`); // Vypsání výsledků
            });
            return undefined; // Vráecní prázdna, exitnutí funkce
        }
        // Pokud uživatel není autor zprávy
        const taggedUser = message.mentions.members.first(); // Vybrání prvního označeného membera
        // Vytažení z DB
        DB.query(`SELECT * FROM warns WHERE (userID = '${taggedUser.id}')`, (err, result) => {
            if (err) throw err; // Vyhození erroru
            return message.channel.send(`**Jméno:** <@${taggedUser.id}>\n**ID uživatele:** ${taggedUser.id}\n**Počet warnů:** ${result.length} \n**Profilovka:** <${taggedUser.user.avatarURL({ dynamic: true, format: 'png'})}>`); // Vypsání informací
        });
    },
};