module.exports = {
	name: 'user-info',
	aliases: ["me"],
	cooldown: 10,
	description: 'Vypíše informace o daném uživateli serveru',
	execute(message) {
		message.channel.send(`**Jméno:** ${message.author.username}\n**ID uživatele:** ${message.author.id}`);
	},
};
