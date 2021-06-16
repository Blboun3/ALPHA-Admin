const Parser = require('rss-parser'); // RSS parser pro parsování RSS feedů
const rssInfo = require('./rssInfo.js'); // RSS config
let parser = new Parser(); // RSS feed parser


module.exports = execute; // Vyexportování execute funkce

global.nf = new Array(); // Pole nevyužitých feedů
nf = ["hi"];

async function execute(client, DB) { // Funkce která bude exportováná, cosi jako "main"
  prepareRSS_Data(DB);
}
var urls = ["https://blog.risingstack.com/rss/", "https://nodesource.com/blog/rss","https://nodesource.com/blog/rss","https://isocpp.org/blog/rss","https://meetingcpp.com/feed.xml","https://realpython.com/atom.xml?format=xml","http://pyfound.blogspot.com/atom.xml","https://planet.scipy.org/feed.xml","https://www.javacodegeeks.com/feed","https://www.infoworld.com/category/java/index.rss","https://www.tecmint.com/feed/","https://www.itsfoss.com/feed/","https://archlinux.org/feeds/news/","https://blogs.windows.com/b/mainfeed.aspx","https://www.windowscentral.com/rss","https://www.onmsft.com/feed","https://writings.stephenwolfram.com/feed/","https://mathwithbaddrawings.com/feed/","https://terrytao.wordpress.com/feed/","https://www.osel.cz/rss/rss.php","https://www.novinky.cz/rss","https://www.zive.cz/rss"];
async function prepareRSS_Data(DB) { //
  // Nejdřív vytáhnu všechny URL adresy a následně zápisy na ně z DB
  for(i = 0; i < rssInfo.rss.length-1; i++){ // Projití všech RSS zdrojů
    let thisRSS = rssInfo.rss[i]; // Získání podrobnějších infromací o daném zdroji
    DB.query(`SELECT * FROM rss WHERE source="${thisRSS.name}" ORDER BY id DESC LIMIT 15`, (err,res) => { // Vytáhnutí informací o zdroji z DB
      if(err) throw err; // Error
        let feed = parser.parseURL(urls[i-1]).then((feed) => {  // Naparsování URL do parseru a následné zpracování
          feed.items.forEach(item => { // Projití všech 15 RSSek
            if(res.find(element => element == item.link) == undefined){ // Pokud je nový => nebyl nalezen v DB
              var thi = {
                feedName: feed.title, // RSS title
                name: item.title, // Title zprávy
                url: item.link, // Link na zprávu
                date: item.pubDate, // Datum publikování
                short: item.contentSnippet, // Zkrácený obsah
                category: rssInfo.rss[i].category // Kategorie
              };
              nf.push(thi); // Připsání do pole, který ale stejně zazanamená změnu jenom uvnitř callbacku pro DB.query()
            }
          });
        });
    });
  }
}

//function sendRSS()
