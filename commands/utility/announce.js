module.exports = {
    name: 'announce', // Jméno
    args: "true", // Argumenty ?
    description: 'Oznámí nějakou zprávu do nějakého kanálu (první parametr channel ID, druhý+ zpráva)', // Popis
    guildOnly: true, // Může běžet pouze v guildě (na serveru)
    permissions: 'KICK_MEMBERS', // Nutná oprávnění
    usage: "[channelID][string announcement]", // Použití
    execute(message, args, client) { // Spuštění s argumenty
      message.guild.channels.cache.get(args[0]).send(args.slice(1).join(" "));
    }
  }
