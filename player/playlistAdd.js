module.exports = (client, message, queue, playlist) => {
    message.channel.send(`${client.emotes.music} - ${playlist.title} byla přidána do playlisut (**${playlist.tracks.length}** skladeb)!`);
};