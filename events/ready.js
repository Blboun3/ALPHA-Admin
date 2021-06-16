const cron = require('node-cron'); // Importování cronu na automatické spouštění
const chalk = require('chalk'); // Importování Chalku na zkrášlení výpisu do console
const rss = require('../others/rss.js'); // Importování RSS knihovny, na zpracování RSS hotovo

module.exports = {
    name: 'ready', // Funkce která proběhne, když se bot zapne
    once: true, // Proběhne pouze jednou
    async execute(client, DB) {
        console.log(chalk.green(`Everything loaded up, bot is ready for use! \n    Prefix is: '!' \n    Bot's user tag is: '${client.user.tag}'`)); // Napíše do console že je online a svůj user.
        console.log(chalk.blue("-------------------------------------"));

        await rss(client, DB); // Spuštění RSS cylkus

        // Nastavení, aby funkce na napsání Čubíkovi proběhla každé ráno v 5.00
        var cubik = cron.schedule('0 5 * * *', function() { // Spustí se každé ráno v 5
          try{
            let dm = client.users.fetch('452547916184158218').then((dm) => {dm.send("Dobré ráno Čubíku");}); // Poslání Čubíkovi dobré ráno
          }catch (error) {
            console.error(error);
          }
        });
        cubik.start(); // Spuštění
        // Nastavení, aby funkce timeUpdate proběhla každých 15 minut
        var five_min = cron.schedule('0,15,30,45 * * * *', function() {
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
                });
            });
        });
        five_min.start(); //Spuštění
    },
};
