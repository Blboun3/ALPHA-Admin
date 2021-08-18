module.exports = {
    name: 'edit', // Jméno
    args: "true", // Argumenty ?
    description: 'Oznámí nějakou zprávu do nějakého kanálu (první parametr channel ID, druhý+ zpráva)', // Popis
    guildOnly: true, // Může běžet pouze v guildě (na serveru)
    permissions: 'KICK_MEMBERS', // Nutná oprávnění
    usage: "[channelID][string announcement]", // Použití
    async execute(message, args, client) { // Spuštění s argumenty
      console.log(await message.guild.channels.cache.get('798093813729329172').fetch('877251054343950366'))
    }
}
