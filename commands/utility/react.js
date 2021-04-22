module.exports = {
	name: 'react',
	description: 'Udělá reakční zprávu, jako je verifikace',
	usage: '<reactionID>',
	permissions: 'ADMINISTRATOR',
	timeout: 0,
	execute: async (message, args, DB) => {
		if(args[0] == 1){
			var embed = {
				color: 0x15fc00,
				title: "Ověření",
				description: "Kliknutí na ✅ souhlasíte s pravidly a zavazujete se k jejich dodržování."
			};
			message.channel.send({embed: embed}).then(sent => {
				message.delete();
				let msgID = sent.id;
				message.channel.messages.fetch({around: msgID, limit: 1}).then(msg => {
					const fetchedMessage = msg.first();
					fetchedMessage.react('✅');
					DB.query(`INSERT INTO configs(configName, configValue) VALUES ("verify_msg", "${msgID}")`,(err) =>{
						if(err) throw err;
					});
				});
			});
		}
	}
};
