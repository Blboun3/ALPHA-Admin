module.exports = {
    name: 'guildMemberRemove',
    execute(member, client, DB) {
        let arr = member.roles.cache.array();
        let rls = new Array();
        arr.forEach(function(rl) {
            if (rl.id != "767628835347890196") { // Filtr pro nepsaní role everyone
                rls.push(rl.id); // Zapsaní
            }
        });
        DB.query(`INSERT INTO users(userID, roles) VALUES ("${member.id}", "${rls}")`, (err) => { // Uložení dat do DB
            if (err) throw err; // Případné vyhození erroru
        });
    }
};