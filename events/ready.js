module.exports = {
    name: 'ready', // Funkce která proběhne, když se bot zapne
    once: true, // Proběhne pouze jednou
    execute(client, DB) {
        console.log(`Everything loaded up, bot is ready for use! \n    Prefix is: '!' \n    Bot's user tag is: '${client.user.tag}'`); // Napíše do console že je online a svůj user.
        console.log("-------------------------------------");
        setInterval(function(){timedUpdate(client, DB);}, 1000 * 3600); // Každou hodinu
    },
};

function timedUpdate(client, DB){ // Funkce která proběhne každých 60 minut
	var memberVoice;
    DB.query(`SELECT configValue FROM configs WHERE configName="membersCounter";`, (err, res) => {
        if (err) throw err;
        memberVoice = res[0].configValue;
        DB.query(`SELECT configValue FROM configs WHERE configName="ageCounter";`, (err, res) => {
            if(err) throw err;
            var ageCounter = res[0].configValue;
            var guild = client.guilds.cache.get(process.env.GUILD_ID);
            var memberCount = guild.memberCount;
            var now = new Date(); // Aktuální čas a Datum
            var create = client.guilds.cache.get(process.env.GUILD_ID).createdAt; // get stáří serveru
            var bt = now - create; // Výpočet stáří
            var age = Math.floor(bt / 86400000); // Výpočet stáří 2
            client.channels.cache.get(memberVoice).setName(`Members: ${memberCount}`); // Nastavení Memberů
            client.channels.cache.get(ageCounter).setName(`Age: ${age} days`); // Nastavení stáří
            var nowT = new Date();
            var hoursN = nowT.getHours();
            var minN = nowT.getMinutes();
        });
    });
    var now = new Date().getHours(); // Získání aktuálního časo
    if (now >= 5 && now <= 6) { // Pokud je mezi 5 a 6 ráno
      client.users.fetch('452547916184158218').then(dm => { // Získání uživatele
        dm.send("Dobré ráno Čubíku") // Poslání Čubíkovi dobré ráno
      })
    }
}
