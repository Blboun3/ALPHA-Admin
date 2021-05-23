// Import knihoven
const tables = require("canvas-table");
const Canvas = require("canvas");
const Discord = require('discord.js'); // DiscordJS

// Nastavení exportu
module.exports = execute;

// Samotná funkce
async function execute(datain, channel, client) {
	const canvas = Canvas.createCanvas(1000,700); // Vytvoření canvasu
  // Projití všech warnů
	var data = [];
  for (const element of datain) {
		let tmp = [];
    var user = client.users.cache.get(element.warnAuthor); // Získání autora warnu
    tmp.push(element.warnID.toString()); // Připsání ID warnu
    tmp.push(`${user.tag}`); // Připsání autora warnu
    tmp.push(element.reason); // Připsání důvodu warnu
    tmp.push(element.warnDate.toString().substring(0,element.warnDate.toString().indexOf("GMT"))); // Přípsání data warnu
    data.push(tmp); // Připsání informací o warnu k ostantím
	}
  const columns = [ // Jména sloupačků
    { title: "ID" },
    { title: "Autor" },
    { title: "Důvod"},
    { title: "Datum a čas" }
  ];
  const options = {
    borders: {
        column: undefined,
        header: undefined,
        row: { width: 1, color: "#555" },
        table: { width: 2, color: "#aaa" }
    },
    cell: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "sans-serif",
        color: "#444444",
        lineHeight: 1.4,
        padding: 5,
        textAlign: "left"
    }
  }
  const ct = new tables.CanvasTable(canvas, { columns, data, options}); // Připravení k vytvoření tabulky
  await ct.generateTable();
  await ct.renderToFile("./ImageGeneration/Images/info.png");
  const attachment = new Discord.MessageAttachment("./ImageGeneration/Images/info.png", 'welcome-image.png');
  channel.send(`TEST01`, attachment);
};