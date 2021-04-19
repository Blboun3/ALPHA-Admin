const mysql = require("mysql"); // Knihovna na pracování s DB
const fs = require('fs'); // FileSync 
const Discord = require('discord.js'); // Knihovna na Discord js

const client = new Discord.Client(); // Discord klient
client.commands = new Discord.Collection(); // příkazy
client.cooldowns = new Discord.Collection(); // a jejich cooldowny

const prefix = "!";

// Vytvoření objektu k připojení k databázi
var DB = mysql.createConnection({
	host: "localhost", // Kam ?
	user: "root", // Kdo ?
	password: "ALPHA_is_best_123", // Heslo
	database: "ALPHA" // DB
});

// Připojení k databázi
DB.connect( (err) => {
	if(err) throw err; // Vyhození erroru
	console.log("Connected!"); // Napsání úspěšného připojení
});

// Vytáhnutí 'tokenu' a přihlášení se k discordu
DB.query(`SELECT configValue FROM configs WHERE (configName='token');`, (err, result) => {
	if (err) throw err; // Vyhození erroru
	client.login(result[0].configValue); // Přihlášení se k discordu, získaným tokenem
});

const commandFolders = fs.readdirSync('./commands'); // složka s příkazy

// Načtení všech příkazů do client.commands
for (const folder of commandFolders) { // Pro každou podsložku (a.k.a kategorii příkazů) 
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js')); // Všechny soubory končící na *.js
	for (const file of commandFiles) { // Pro každý takový soubor
		const command = require(`./commands/${folder}/${file}`); // Příkaz
		client.commands.set(command.name, command); // Přípsání příkazu do colekce pro bota
	}
}

// Když je ready
client.once('ready', () => {
	console.log("ALPHA Admin discord bot je ready"); // Tak napíše do console, že je ready
});

client.on('message', (message) => {
	if(!message.content.startsWith(prefix) || message.author.bot) return; // DoaČasné, pokud zpráva nezačíná prefixem nebo jí napsal bot
	
	// Zpracování vstupu, vytáhnutí argumentů a příkazu
	const args = message.content.slice(prefix.length).trim().split(/ +/); 
	const commandName = args.shift().toLowerCase();
	
	// najití příkazu nebo najití příkazu pomocí jeho aliasů
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	
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
			reply += `\nSprávné použití je: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply); // Odeslání odpovědí a vyskočení z funkce
	}

	const { cooldowns } = client; // Seznam cooldownu ???

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
});
