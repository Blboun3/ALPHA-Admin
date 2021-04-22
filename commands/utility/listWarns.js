module.exports = {
    name: 'list-warns',
    aliases: ["lwarn", "warns", "warnings"],
    usage: "[user]",
    execute(message, args, DB) {
        if (!message.mentions.users.size) {
            DB.query(`SELECT * FROM warns WHERE userID="${message.author.id}"`, (err, result) => {
                if (err) throw err;
                if (!result.length > 0) {
                    return message.channel.send("Vypadá to, že jsi bezúhonný uživatel ALPHY!");
                }
                var out;
                for (const element of result) {
                    let output = `**${element.warnID}** | <@!${element.warnAuthor}> | ${element.reason} | ${element.warnDate} \n`;
                    out = out + output;
                };
                return message.channel.send(out);
            });
        } else {

            const taggedUser = message.mentions.members.first();

            DB.query(`SELECT * FROM warns WHERE userID="${taggedUser.id}"`, (err, result) => {
                if (err) throw err;
                var out = "ID | Autor | Důvod | Datum a čas \n" +
                    "-------------------------------- \n"
                for (const element of result) {
                    let output = `**${element.warnID}** | <@!${element.warnAuthor}> | ${element.reason} | ${element.warnDate} \n`;
                    out = out + output;
                }
                console.log(out);
                return message.channel.send(out);
            });
        }

    }
}