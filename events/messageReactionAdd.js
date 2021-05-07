module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user, client, DB) {
        if (reaction.partial) { // Pokud je partial
            try {
                await reaction.fetch(); // fetchnout celou reaction
            } catch (error) { // error
                console.log("Something went wrong while fetching message");
                return;
            }
        }
        const member = reaction.message.guild.member(user); // Získání membera
        if(member.id == "797862942036721664"){ // Pokud reakce přidal robot
            return undefined
        }
        console.log(reaction);
        DB.query(`SELECT * FROM configs WHERE configName LIKE "%Role%" OR configName LIKE "%msg%" ORDER BY configID;`, (err, results) => { // Vytáhnutí rolí, zpráv a channelů z DB
            if (err) throw err;
            switch (reaction.message.id) {
                case results[6].configValue:
                    reaction.users.remove(user.id);
                    switch (reaction.emoji.name) {
                        case "🧮":
                            if (member.roles.cache.has(results[2].configValue)) {
                                member.roles.remove(results[2].configValue);
                            } else {
                                member.roles.add(results[2].configValue);
                            }
                            break;
                        case "💻":
                            if (member.roles.cache.has(results[0].configValue)) {
                                member.roles.remove(results[0].configValue);
                            } else {
                                member.roles.add(results[0].configValue);
                            }
                            break;
                        case "🔋":
                            if (member.roles.cache.has(results[1].configValue)) {
                                member.roles.remove(results[1].configValue);
                            } else {
                                member.roles.add(results[1].configValue);
                            }
                            break;
                        case "⚛️":
                            if (member.roles.cache.has(results[3].configValue)) {
                                member.roles.remove(results[3].configValue);
                            } else {
                                member.roles.add(results[3].configValue);
                            }
                            break;
                    }
                    break;
                default:
                    switch (reaction.emoji.name) {
                        case "🏳️‍🌈":
                            reaction.users.remove(user.id);
                            reaction.message.channel.send('lgbt very bad').then(msg => {
                                msg.delete({
                                    timeout: 10000
                                });
                            });
                            break;
                        case "🏳️‍⚧️":
                            reaction.users.remove(user.id);
                            reaction.message.channel.send('lgbt very bad').then(msg => {
                                msg.delete({
                                    timeout: 10000
                                });
                            });
                            break;
                        case "🌈":
                            reaction.users.remove(user.id);
                            reaction.message.channel.send('lgbt very bad').then(msg => {
                                msg.delete({
                                    timeout: 10000
                                });
                            });
                            break;
                        case "🖕":
                            reaction.users.remove(user.id);
                            user.send('Čím to jako reaguješ na zprávy ? Co si to jako dovoluješ ?');
                            break;
                    }
            }
        });
    },
}
