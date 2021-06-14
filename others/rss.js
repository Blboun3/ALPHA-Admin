const Parser = require('rss-parser'); // RSS parser pro parsování RSS feedů
let parser = new Parser(); // RSS feed parser

module.exports = execute; // Vyexportování execute funkce

let nf = new Array(); // Pole nevyužitých feedů

function execute(client, DB){
  var rss = ["https://blog.risingstack.com/rss/","https://nodesource.com/blog/rss"] // RSS adresy
  let feed = parser.parseURL(rss[0]).then((feed) => {
    feed.items.forEach(item => { // Pro každou RSS položku na daném serveru
      // Najití URL adresy v databázi
      DB.query(`SELECT * FROM rss WHERE url="${item.link}"`, (err,res) => {
        if(err) throw err; // Error ?
        var thisFeed = {}; // Vytvoření "tohoto feedu"
        if(res.lenght != 0){ // Pokud nenašel, jedná se o nový feed
          // Uložení informací do objektu
          thisFeed = {
            feedTitle:feed.title, // Title stránky odkud feed pochází
            title:item.title, // Title feedu
            url:item.link, // Odkaz na feed
            date:new Date(item.pubDate), // Datum, kdy byl feed vydaný
            short:item.contentSnippet // O čem feed je zkráceně
          };
          nf.push(thisFeed); // Přidání informací o tomhle feedu do pole feedů
        }
        return nf;
      });
    });
    console.log("nf");
  });
}
