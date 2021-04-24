module.exports = { 
    name: 'guildMemberRemove', // Funkce která proběhne, když se někdo odpojí
    execute(member, client, DB) { // Předání arguemntů, member (člen), client (discord) a DB (databáze)
        let arr = member.roles.cache.array(); // získání rolí uživatele
        let rls = new Array(); // vytvoření nového pole na role
        arr.forEach(function(rl) { // Pro každou roli v rolích
            if (rl.id != "767628835347890196") { // Filtr pro nepsaní role everyone
                rls.push(rl.id); // Zapsání do nového stringi
            }
        });
        DB.query(`INSERT INTO users(userID, roles) VALUES ("${member.id}", "${rls}")`, (err) => { // Uložení dat do DB
            if (err) throw err; // Případné vyhození erroru
        });
    }
};