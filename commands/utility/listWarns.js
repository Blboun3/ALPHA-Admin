module.exports = {
    name: 'list-warns', // Jméno
    aliases: ["lwarn", "warns", "warnings"], // Aliasy
    usage: "[user]", // Použití
    execute(message, args, DB) { // Spuštění s argumenty
        if (!message.mentions.users.size) { // Pokud není označený žádný uživatel
            DB.query(`SELECT * FROM warns WHERE userID="${message.author.id}"`, (err, result) => { //  Vytáhnutí dat z DB
                if (err) throw err; // Vyhození erroru
                if (!result.length > 0) { // Pokud nic nenašel
                    return message.channel.send("Vypadá to, že jsi bezúhonný uživatel ALPHY!");
                }
                var out = "ID | Autor | Důvod | Datum a čas \n" +  // Příprava tabulky výsledků
                        "-------------------------------- \n"
                for (const element of result) { // Pro každý výsledek
                    let output = `**${element.warnID}** | <@!${element.warnAuthor}> | ${element.reason} | ${element.warnDate} \n`; // Zformátování
                    out = out + output; // Připsání do výstupu
                };
                return message.channel.send(out); // Poslání výsledků
            });
        } else {

            const taggedUser = message.mentions.members.first();

            DB.query(`SELECT * FROM warns WHERE userID="${taggedUser.id}"`, (err, result) => {
                if (err) throw err;
                if(result.length > 0){
                    var out = "ID | Autor | Důvod | Datum a čas \n" +  // Příprava tabulky výsledků
                        "-------------------------------- \n"
                    for (const element of result) { // Pro každý výsledek
                        let output = `**${element.warnID}** | <@!${element.warnAuthor}> | ${element.reason} | ${element.warnDate} \n`; // Zpracování výsledků
                        out = out + output; // Připsání k výstupu
                    }
                    console.log(out);
                    return message.channel.send(out); // Poslání výsledků
                }
                return message.channel.send(`Vypadá to, že uživatel <@!${taggedUser.id}> je bezúhonným uživatelem ALPHY!`); // Vypsání informace o bezůhonnosti
            });
        }

    }
}