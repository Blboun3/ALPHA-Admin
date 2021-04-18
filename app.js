const mysql = require("mysql"); // Knihovna na pracování s DB
const fs = require('fs'); // FileSync 
const Discord = require('discord.js'); // Knihovna na Discord js

const client = new Discord.Client(); // Discord klient
client.commands = new Discord.Collection(); // příkazy
client.cooldowns = new Discord.Collection(); // a jejich cooldowny

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

// Vytáhnutí 'tokenu'
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
