module.exports = {
	name: 'ban',
	description: 'Dá ban označenému členovi',
	usage: "<user> [reason]",
	args: "true",
	guildOnly: true,
	permissions: 'BAN_MEMBERS',
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply('Musíš označit nějakého uživatele');
		}

		const taggedUser = message.mentions.members.first();
		taggedUser.ban(args[1]);
		message.channel.send(`Dal jsi ban: ${taggedUser.username}`);
	},
};
