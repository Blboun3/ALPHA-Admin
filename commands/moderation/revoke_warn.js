module.exports = {
    name: 'revoke-warn', // Jméno
    aliases: ["rwarn"], // Aliasy
    description: 'Smaže warn podle warnID', // Popis
    usage: "<warnID>", // Použití
    args: "true", // Má argumenty ?
    guildOnly: "true", // Spustitelný pouze na serveru
    permissions: 'KICK_MEMBERS', // Nutná oprávnění
    execute(message, args, DB) { // Parametry: zpráva, argumenty a databáze
        DB.query(`SELECT userID,reason FROM warns WHERE warnID="${args[0]}"`, (err, result) => { // Vybrání warnu z DB, podle warnID (aka argument 1)
            if (!result.length > 0) { // Pokud nic nenašel
                return message.channel.send(`Zdá se, že tady není žádný záznam s tímto ID!`); // Uživatel nemá warn
            }
            if (err) throw err; // Vyhození erroru
            DB.query(`DELETE FROM warns WHERE warnID="${args[0]}"`, (errII, resultII) => { // Smazání warnu z DB
                if (errII) throw errII; // error
                return message.channel.send(`Uživateli <@!${result[0].userID}> byl odebrán warn ${args[0]} za "${result[0].reason}"`); // Napsání, že uživateli byl odebrán warn za <důvod>
            });
        });
    },
}