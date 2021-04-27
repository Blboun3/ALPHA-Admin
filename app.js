/*
ALPHA Admin Discord Bot
Autor: Blboun3
Omlouvám se za překlepy v komentářích, doufám, že budou případně dost srozumitelné, pro pochopení kódu-
*/

const mysql = require("mysql2"); // Knihovna na pracování s DB, nutná mysql2 !! mysql nemám podporovaný login systém
const fs = require('fs'); // FileSystem
const Discord = require('discord.js'); // Knihovna na Discord js
require('dotenv').config() // Dotenv


const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER', 'MEMBERS'] // Discord bot konfigurace
}); // Discord klient
client.commands = new Discord.Collection(); // příkazy
client.cooldowns = new Discord.Collection(); // a jejich cooldowny

global.__basedir = __dirname; // Globální proměnná uchovávajíci cestu k základní složce ze které program běží
global.__prefix = process.env.BOT_PREFIX; // Globální proměnná pro ____prefix

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
    host: process.env.DB_IP, // Kam ?
    user: process.env.DB_USER, // Kdo ?
    password: process.env.DB_PASSWORD, // Heslo
    database: process.env.DB_NAME, // DB
});

DB.connect((err) => {
    if (err) throw err; // Vyhození erroru
    console.log("Connected!"); // Napsání úspěšného připojení
});

//guild.members.filter(member => !member.user.bot).size
client.login(process.env.BOT_TOKEN); // Přihlášení se k discordu, získaným tokenem