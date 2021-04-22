module.exports = {
    name: 'revoke-warn',
    aliases: ["rwarn", ""],
    description: 'Smaže warn podle warnID',
    usage: "<warnID>",
    args: "true",
    guildOnly: "true",
    permissions: 'KICK_MEMBERS',
    execute(message, args, DB) {
        /*if(args.length < 2){
        	return message.channel.send("Musíš zadat 2 argumenty");
        }*/
        DB.query(`SELECT userID,reason FROM warns WHERE warnID="${args[0]}"`, (err, result) => {
            if (!result.length > 0) {
                return message.channel.send(`Zdá se, že tady není žádný záznam s tímto ID!`);
            }
            if (err) throw err;
            DB.query(`DELETE FROM warns WHERE warnID="${args[0]}"`, (errII, resultII) => {
                if (errII) throw errII;
                return message.channel.send(`Uživateli <@!${result[0].userID}> byl odebrán warn ${args[0]} za "${result[0].reason}"`);
            });
        });
    },
}