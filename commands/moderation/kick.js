module.exports = {
    name: 'kick', // Jméno
    description: 'Kickne označeného uživatele', // Popis
    usage: "<user> [reason]", // Použití
    args: "true", // Má argumenty
    guildOnly: true, // spustitelný pouze na serveru
    permissions: 'KICK_MEMBERS', // nutná oprávnění ke spuštění tohoto příkazu
    execute(message, args) { // Parametry: Zpráva a argumenty
        if (!message.mentions.users.size) { // Pokud není označen žádný uživatel
            return message.reply('Musíš označit nějakého uživatele');
        }

        const taggedUser = message.mentions.members.first(); // Vybrání prnvího označeného člena
        const memberID = taggedUser.id; // ID daného uživatele
        taggedUser.kick(args[1]); // Vykopnutí daného uživatele, argument 1 je důvod viditelný v audit logu
        return message.channel.send(`Kicknul jsi: <@!${userID}>`); // Napsání, že daný uživatel byl vykopnut
    },
};