/*
ALPHA Admin Discord Bot
Autor: Blboun3
Omlouvám se za překlepy v komentářích, doufám, že budou případně dost srozumitelné, pro pochopení kódu-
*/

const mysql = require("mysql2"); // Knihovna na pracování s DB, nutná mysql2 !! mysql nemám podporovaný login systém
const fs = require('fs'); // FileSystem
const Discord = require('discord.js'); // Knihovna na Discord js
require('dotenv').config() // Dotenv
const { Player } = require('discord-player');
const chalk = require('chalk'); // Importování Chalku na zkrášlení výpisu do console

const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER', 'MEMBERS'] // Discord bot konfigurace
}); // Discord klient
client.commands = new Discord.Collection(); // příkazy
client.cooldowns = new Discord.Collection(); // a jejich cooldowny
client.player = new Player(client);
client.config = require('./others/bot');
client.emotes = client.config.emojis;
client.filters = client.config.filters;

global.__basedir = __dirname; // Globální proměnná uchovávajíci cestu k základní složce ze které program běží
global.__prefix = process.env.BOT_PREFIX; // Globální proměnná pro ____prefix
global.__badWords = "";

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js')); // Složka s event handlery
const player = fs.readdirSync('./player').filter(file => file.endsWith('.js'));

console.log("\n \n \n ")
console.log(chalk.rgb(123, 45, 67).bold("-------------------------------------"));
console.log(chalk.rgb(123, 45, 67).bold("       ALPHA-Admin discord bot       "));
console.log(chalk.rgb(123, 45, 67).bold("-------------------------------------"));
console.log(chalk.blue("Loading:"));
console.log(chalk.blue("---|----"));

for (const file of eventFiles) { // Projití všech eventů
    console.log(`   ${chalk.blue("|->")}` + chalk.green(` discord.js event ${file}`));
    const event = require(`./events/${file}`); // Requirnutí eventu
    if (event.once) { // Jestli je to event, který má být zavolaný pouze jednou
        client.once(event.name, (...args) => event.execute(...args, client, DB)); // Nastavení eventu na client.once();
    } else { // Event který se spustí vícekrát (message, reasction, memberADD, memberREMOVE atd.)
        client.on(event.name, (...args) => event.execute(...args, client, DB)); // Nastavení eventu
    }
}

// Přidání player věcí
for (const file of player) {
    console.log(`   ${chalk.blue("|->")}` + chalk.green(` discord-player event ${file}`));
    const event = require(`./player/${file}`);
    client.player.on(file.split(".")[0], event.bind(null, client));
};

/*
Tento kód je upravenou verzí kódu z oficiální dokumentace pro discord bota
*/
const commandFolders = fs.readdirSync(__basedir + '/commands'); // složka s příkazy

// Načtení všech příkazů do client.commands
for (const folder of commandFolders) { // Pro každou podsložku (a.k.a kategorii příkazů)
    const commandFiles = fs.readdirSync(__basedir + `/commands/${folder}`).filter(file => file.endsWith('.js')); // Všechny soubory končící na *.js
    for (const file of commandFiles) { // Pro každý takový soubor
        console.log(`   ${chalk.blue("|->")}` + chalk.green(` command ${file} in folder ${folder}`));
        const command = require(__basedir + `/commands/${folder}/${file}`); // Příkaz
        client.commands.set(command.name, command); // Přípsání příkazu do colekce pro bota
    }
}

// Vytvoření objektu k připojení k databázi
var DB = mysql.createConnection({
    host: process.env.DB_IP, // Kam ?
    user: process.env.DB_USER, // Kdo ?
    password: process.env.DB_PASSWORD, // Heslo
    database: process.env.DB_NAME, // DB
});

DB.connect((err) => {
    if (err) throw err; // Vyhození erroru
    console.log(chalk.blue("-------------------------------------"));
    console.log(chalk.green(`Succesfully connected to databse '${process.env.DB_NAME}' on '${process.env.DB_IP}' as user '${process.env.DB_USER}'`)); // Napsání úspěšného připojení
});

client.login(process.env.BOT_TOKEN); // Přihlášení se k discordu, získaným tokenem
