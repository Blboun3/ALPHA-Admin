module.exports = {
    name: 'count', // Jméno
    description: 'Vypíše informace o počítání', // Popis
    aliases: ['cnt', 'numbers'], // Aliasi
    cooldown: 5, // Cooldown
    execute(message, args, DB) { // Spuštění
        DB.query(`SELECT * FROM counting`, (err, result) => {
            const exampleEmbed = {
                color: 0x15fc00,
                title: "Počítání",
                description: `Počítá se v channelu: <#803889724598386689> \nPoslední číslo: ${fib(parseInt(result[0].value))} \nNejvyšší dosažené číslo: ${fib(parseInt(result[1].value))} \nNejlepší počtář: <@!${result[3].value}>`
            }
        });
    },
};

function fib(number){
    var top1 = Math.pow(((1+Math.sqrt(5))/2), number);
    var top2 = Math.pow(((1-Math.sqrt(5))/2), number);
    var fibNr = (top1 - top2)/Math.sqrt(5);
    return fibNr;
}