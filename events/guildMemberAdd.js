module.exports = {
    name: 'guildMemberAdd', // Když se připojí nový member
    execute(member, client, DB) { // Předává informace o čelnovi, client (aka bot) a DB (databáze)
        DB.query(`SELECT roles FROM users WHERE userID="${member.id}"`, (err, result) => { // Najití uživatele v databázi, kam se zapíší role člena, který se odpojí
            if (err) throw err; // pokud error, hoď error
            if (!result.length > 0) { // Pokud nenašel uživatele
                return undefined; // Vrátí undefined (exitne funkci)
            }
            var rls = result[0].roles.split(","); // pokud našel role, tak je rozdělí po ","
            if (rls != undefined) { // Pokud role jsou undefined (člen leavnul, ale neměl žádný role, ani verify)
                rls.forEach(function(rl) { // pro každý item v poli
                    let role = member.guild.roles.cache.find(role => role.id == rl); // Najití role
                    member.roles.add(role); // Přidání rolí uživateli
                });
                DB.query(`DELETE FROM users WHERE userID="${member.id}"`, (err) => { // Smazání užicatele z databáze uživatelů, kteří leavly, důvod je, aby se případně nějak nekombinovali role
                    if (err) throw err; // Pokud error, hoď error
                });
            }
        });
    },
};