module.exports = {
	name: 'user-info',
	aliases: ["me"],
	cooldown: 10,
	description: 'Vypíše informace o daném uživateli serveru',
	execute(message) {
		if (!message.mentions.users.size){
			return message.channel.send(`**Jméno:** ${message.author.username}\n**ID uživatele:** ${message.author.id}`);
		}
		const taggedUser = message.mentions.members.first();

		return message.channel.send(`**Jméno:** ${taggedUser.tag}\n**ID uživatele:** ${taggedUser.id}`);
	},
};
