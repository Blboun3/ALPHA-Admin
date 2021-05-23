module.exports = (client, message, queue) => {
    message.channel.send(`${client.emotes.error} - Hudba přestala hrát, protože jsem přehrál všechno ve frotně!`);
};