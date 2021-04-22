module.exports = {
    name: 'warn',
    description: 'Dá warn označenému uživateli',
    usage: "<user> <reason>",
    args: "true",
    guildOnly: "true",
    permissions: 'KICK_MEMBERS',
    execute(message, args, DB) {
        /*if(args.length < 2){
        	return message.channel.send("Musíš zadat 2 argumenty");
        }*/
        if (!message.mentions.users.size) {
            return message.channel.send('Musíš označit nějakého uživatele');
        }

        const taggedUser = message.mentions.members.first();
        let d = new Date;
        let thisDate = '"' + [d.getFullYear(),
            d.getMonth() + 1,
            d.getDate()
        ].join('-') + ' ' + [d.getHours(),
            d.getMinutes(),
            d.getSeconds()
        ].join(':') + '"';

        DB.query(`INSERT INTO warns (warnDate, userID, warnAuthor, reason) VALUES ( ${thisDate}, ${taggedUser.id}, ${message.author.id},"${args[1]}")`, (err, result) => {
            if (err) throw err;
            return message.channel.send(`Uživatel <@!${taggedUser.id}> byl varován z důvodu ${args[1]}`);
        });
    },
}