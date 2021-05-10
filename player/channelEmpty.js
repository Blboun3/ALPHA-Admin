module.exports = (client, message, queue) => {
    message.channel.send(`${client.emotes.error} - Hudba přestala hrát, protože jste mě tu opustili!`);
};