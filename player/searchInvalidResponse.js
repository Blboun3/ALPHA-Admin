module.exports = (client, message, query, tracks, content, collector) => {
    if (content === 'cancel') {
        collector.stop();
        return message.channel.send(`${client.emotes.success} - Výběr **byl zrušen** !`);
    } else message.channel.send(`${client.emotes.error} - Musíš poslat exsistující číslo mezi **1** a **${tracks.length}** !`);
};