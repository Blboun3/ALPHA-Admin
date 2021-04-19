module.exports = {
	name: 'kick',
	description: 'Kickne označeného membera',
	usage: "<user> [reason]",
	args: "true",
	guildOnly: true,
	permissions: 'KICK_MEMBERS',
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply('Musíš označit nějakého uživatele');
		}

		const taggedUser = message.mentions.members.first();
		taggedUser.kick(args[1]);
		return message.channel.send(`Kicknul jsi: ${taggedUser.tag}`);
	},
};
