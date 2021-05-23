module.exports = (client, message, queue) => {
    message.channel.send(`${client.emotes.error} - Přehrávání hudby bylo ukončeno, protože jsem byl odpojen z voice channelu!`);
};