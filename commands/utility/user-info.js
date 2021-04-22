module.exports = {
    name: 'user-info',
    aliases: ["me"],
    cooldown: 10,
    description: 'Vypíše informace o daném uživateli serveru',
    execute(message, args, DB) {
        // Jestliže se jedná o autora
        if (!message.mentions.users.size) {
            // Vytažení z DB
            DB.query(`SELECT * FROM warns WHERE (userID = '${message.author.id}')`, (err, result) => {
                if (err) throw err; // Vyhození erroru
                return message.channel.send(`**Jméno:** <@${message.author.id}>\n**ID uživatele:** ${message.author.id}\n**Počet warnů:** ${result.length} \n**Odkaz na tvojí profilovku:** <${message.author.displayAvatarURL({ dynamic: true })}>`); // Vypsání výsledků
            });
            return undefined;
        }
        // Pokud uživatel není autor zprávy
        const taggedUser = message.mentions.members.first();
        // Vytažení z DB
        DB.query(`SELECT * FROM warns WHERE (userID = '${taggedUser.id}')`, (err, result) => {
            if (err) throw err;
            return message.channel.send(`**Jméno:** <@${taggedUser.id}>\n**ID uživatele:** ${taggedUser.id}\n**Počet warnů:** ${result.length} \n**Profilovka:** <${message.member.user.displayAvatarURL({ dynamic: true})}>`); // Vypsání informací
        });
    },
};