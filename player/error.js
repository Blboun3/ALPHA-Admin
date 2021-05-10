module.exports = (client, error, message, ...args) => {
    switch (error) {
        case 'NotPlaying':
            message.channel.send(`${client.emotes.error} - Aktuálně na tomto serveru nehraje žádny hudba!`);
            break;
        case 'NotConnected':
            message.channel.send(`${client.emotes.error} - Vypadá to, že nejsi připojený v žádném hlasovém kanále!`);
            break;
        case 'UnableToJoin':
            message.channel.send(`${client.emotes.error} - Nemohu se připojit do tvého hlasového kanálu, protoŹe postrádám správná oprávnění!`);
            break;
        case 'VideoUnavailable':
            message.channel.send(`${client.emotes.error} - ${args[0].title} není dostupná ve vaší zemí! Přeskakuji...`);
            break;
        case 'MusicStarting':
            message.channel.send(`Hudba se spouští... prosím počkejte, a zkuste to znovu později!`);
            break;
        default:
            message.channel.send(`${client.emotes.error} - Něco se podělalo ... Error : ${error}`);
    };
};
