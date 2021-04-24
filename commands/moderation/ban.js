module.exports = {
    name: 'ban', // Jméno
    description: 'Dá ban označenému členovi', // Popis
    usage: "<user> [reason]", // Použití
    args: "true", // Argumenty ?
    guildOnly: true, // Může běžet pouze v guildě (na serveru)
    permissions: 'BAN_MEMBERS', // Nutná oprávnění
    execute(message, args) { // Předání parametrů: message => zpráva od uživatele, args => zpracovené argumenty
        if (!message.mentions.users.size) { // Jestli není označen žádný member
            return message.reply('Musíš označit nějakého uživatele');
        }

        const taggedUser = message.mentions.members.first(); // vybrání a uložení prvního označeného uživatele
        const userID = taggedUser.id; // ID uživatele
        taggedUser.ban(args[1]); // dá ban danému uživateli, argument 1 je důvod, zobrazitelný v audit logu
        message.channel.send(`Dal jsi ban: <@!${userID}>`); // Napsání, že daný uživatel byl zabanován
    },
};