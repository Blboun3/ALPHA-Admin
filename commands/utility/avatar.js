module.exports = {
	name: 'avatar',
	description: 'Pošle URL adresu profilovky daného uživatele nebo autora zprávy',
	aliases: ['icon', 'pfp'],
	execute(message) {
		if (!message.mentions.users.size) {
			return message.channel.send(`Tvoje profilovka: <${message.author.displayAvatarURL({ dynamic: true })}>`);
		}

		const avatarList = message.mentions.users.map(user => {
			return `Profilovka uživatele ${user.username}: <${user.displayAvatarURL({ dynamic: true })}>`;
		});

		message.channel.send(avatarList);
	},
};
