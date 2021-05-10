module.exports = {
    name: 'die',
    description:"Odpojí bota z fronty",
    aliases: ['leave'],

    execute(message,args,DB,client) {
    	client.player.stop(message);
    	message.channel.send(`${client.emotes.success} - Opouštím voice roomku na přání uživatele ${message.author.tag}!`);
    },
};