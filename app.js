const mysql = require("mysql"); // Knihovna na pracování s DB
const fs = require('fs'); // FileSync 
const Discord = require('discord.js'); // Knihovna na Discord js

const client = new Discord.Client({
	partial:['MESSAGE', 'CHANNEL', 'REACTION'] // Discord bot konfigurace
}); // Discord klient
client.commands = new Discord.Collection(); // příkazy
client.cooldowns = new Discord.Collection(); // a jejich cooldowny

const prefix = "!"; // Prefix

global.__basedir = __dirname; // Globální proměnná uchovávajíci cestu k základní složce ze které program běží

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js')); // Složka s event handlery

for (const file of eventFiles) { // Projití všech eventů
	const event = require(`./events/${file}`); // Requirnutí eventu
	if (event.once) { // Jestli je to event, který má být zavolaný pouze jednou
		client.once(event.name, (...args) => event.execute(...args, client, DB)); // Nastavení eventu na client.once();
	} else { // Event který se spustí vícekrát (message, reasction, memberADD, memberREMOVE atd.)
		client.on(event.name, (...args) => event.execute(...args, client, DB)); // Nastavení eventu
	}
}

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

