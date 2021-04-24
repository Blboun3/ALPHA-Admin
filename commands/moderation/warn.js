module.exports = {
    name: 'warn', // Jméno
    description: 'Dá warn označenému uživateli', // Popis
    usage: "<user> <reason>", // Použití
    args: "true", // má argumenty ?
    guildOnly: "true", // Použitelný pouze na serveru
    permissions: 'KICK_MEMBERS', // Nutná oprávnéní
    execute(message, args, DB) { // argumenty: zpráva, argumetny, databáze
        if (!message.mentions.users.size) { // Pokud není označený žádný člověk
            return message.channel.send('Musíš označit nějakého uživatele'); 
        }

        const taggedUser = message.mentions.members.first(); // Vybrání prvního označeného uźivatele
        let d = new Date; // Datum
        let thisDate = '"' + [d.getFullYear(),
            d.getMonth() + 1,
            d.getDate()
        ].join('-') + ' ' + [d.getHours(),
            d.getMinutes(),
            d.getSeconds()
        ].join(':') + '"';  // Zpracování data do správného formátu kvůli DB

        DB.query(`INSERT INTO warns (warnDate, userID, warnAuthor, reason) VALUES ( ${thisDate}, ${taggedUser.id}, ${message.author.id},"${args[1]}")`, (err, result) => { // Zapsání warnu do DB
            if (err) throw err; // Vyhození error
            return message.channel.send(`Uživatel <@!${taggedUser.id}> byl varován z důvodu ${args[1]}`); // Napsání, že uživatel byl varován
        });
    },
}