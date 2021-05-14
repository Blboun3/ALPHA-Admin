module.exports = {
    name: 'die',
    description:"Odpojí bota z fronty",
    aliases: ['leave'],
    guildOnly: true, // spustitelný pouze na serveru

    execute(message,args,DB,client) {
    	if(client.player.isPlaying()){
    		client.player.stop(message);
    		message.channel.send(`${client.emotes.success} - Opouštím voice roomku na přání uživatele ${message.author.tag}!`);
    	}else{
    		message.channel.send(`${client.emotes.fail} - Vypadá to, že nejsem v žádné voice roomce!`);
    	}
    },
};