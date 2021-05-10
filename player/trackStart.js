module.exports = (client, message, track) => {
    message.channel.send(`${client.emotes.music} - Nyní hraje \`${track.title}\` v \`${message.member.voice.channel.name}\``);
};