module.exports = {
    name: 'guildMemberAdd',
    execute(member, client, DB) {
        DB.query(`SELECT roles FROM users WHERE userID="${member.id}"`, (err, result) => {
            if (err) throw err;
            if (!result.length > 0) {
                return undefined;
            }
            var rls = result[0].roles.split(",");
            if (rls != undefined) {
                rls.forEach(function(rl) {
                    let role = member.guild.roles.cache.find(role => role.id == rl);
                    member.roles.add(role); // Přidání rolí uživateli
                });
                DB.query(`DELETE FROM users WHERE userID="${member.id}"`, (err) => {
                    if (err) throw err;
                });
            }
        });

    },
};