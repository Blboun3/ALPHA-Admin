const fs = require('fs'); // FileSystem
const Discord = require('discord.js'); // DiscordJS
module.exports = {
    name: 'message', // Proběhne, když někdo napíše zprávu
    execute(message, client, DB) { // parametry: zpráva, client (bot) a DB (databáze)
        // Zjištění, jestli je zpráva ve verify channelu
        DB.query(`SELECT configValue FROM configs WHERE configName="verify_channel"`, (err, result) => { // Vytažení channelu z DB
            if(err) throw err; // Vyhození erroru
            if(message.channel.id == result[0].configValue){ // Pokud je zpráva ve verifikačním channelu
               if(message.content.toLowerCase() == message.author.tag.toLowerCase()){ // Pokud verifikace projde
                DB.query(`SELECT configValue FROM configs WHERE configName="verifiedRole"`, (errA, resultA) => { // Vytažení verified role ID z DB
                    if(errA) throw errA; // Vyhození erroru
                    message.member.roles.add(resultA[0].configValue);
                    message.delete();
                });
               }else{
                if(!message.author.bot){
                    message.channel.send("Vypadá to, že toto není správně, zkus to prosím znovu").then(msg => {
                        msg.delete({timeout: 10000});
                    });
                    message.delete();
                   }
                }    
            }
        });
    	/*
    	Tento kód je upravenou verzí kódu z oficiální dokumentace pro discord bota 
    	*/
        const commandFolders = fs.readdirSync(__basedir + '/commands'); // složka s příkazy

        // Načtení všech příkazů do client.commands
        for (const folder of commandFolders) { // Pro každou podsložku (a.k.a kategorii příkazů) 
            const commandFiles = fs.readdirSync(__basedir + `/commands/${folder}`).filter(file => file.endsWith('.js')); // Všechny soubory končící na *.js
            for (const file of commandFiles) { // Pro každý takový soubor
                const command = require(__basedir + `/commands/${folder}/${file}`); // Příkaz
                client.commands.set(command.name, command); // Přípsání příkazu do colekce pro bota
            }
        }
        if (!message.content.startsWith(__prefix) || message.author.bot) return; // DoaČasné, pokud zpráva nezačíná __prefixem nebo jí napsal bot

        // Zpracování vstupu, vytáhnutí argumentů a příkazu
        const args = message.content.slice(__prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // najití příkazu nebo najití příkazu pomocí jeho aliasů
        const command = client.commands.get(commandName) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        // Pokud příkaz neexsistuje
        if (!command) return;

        // pokud se jedná o příkaz použitelný pouze na serveru
        if (command.guildOnly && message.channel.type === 'dm') {
            return message.reply('Tento příkaz je použitelný pouze na serveru, ne v DM');
        }

        // Zkontrolování uživatelských oprávnění
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author); // Permissions autora 
            if (!authorPerms || !authorPerms.has(command.permissions)) { // Pokus permise nesedí
                return message.reply('Vypadá to, že na tento příkaz nemáš oprávnění');
            }
        }

        // Zkontrolování argumentu
        if (command.args && !args.length) {
            let reply = `Vypadá to, že takto se tento příkaz nepoužívá, zadal jsi málo argumentu, ${message.author}!`; // Nedostatek argumentů

            if (command.usage) {
                reply += `\nSprávné použití je: \`${__prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply); // Odeslání odpovědí a vyskočení z funkce
        }

        const {
            cooldowns
        } = client; // Seznam cooldownu ???

        if (!cooldowns.has(command.name)) { // jestli není command na seznamu cooldown příkazů
            cooldowns.set(command.name, new Discord.Collection()); // asi ho tam nastaví
        }

        const now = Date.now(); // Získaní aktuálního data a času
        const timestamps = cooldowns.get(command.name); // získání příkazu
        const cooldownAmount = (command.cooldown || 3) * 1000; // získání cooldownu

        if (timestamps.has(message.author.id)) { // jestliže autor použil příkaz ??
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount; // kolik ještě

            if (now < expirationTime) { // Jestli je na cooldownu
                const timeLeft = (expirationTime - now) / 1000; // přepočítání na sekundy
                return message.reply(`Prosím počkej ${timeLeft.toFixed(1)} sekund před použitím \`${command.name}\` znovu.`);
            }
        }

        timestamps.set(message.author.id, now); // Nastavení timestampu pro autora
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); // nastavení timeout funkce na vyčištění timestamps

        try {
            command.execute(message, args, DB); // Pokus o spuštění příkazů
        } catch (error) {
            console.error(error); // Blbec proof try catch block, hození error
            message.reply('Někde došlo k chybě a váš příkaz se nepodařilo zpracovat, omlouváme se za problém.'); // Napsání chyby
        }

    },
};