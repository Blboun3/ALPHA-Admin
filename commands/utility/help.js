const prefix = "!";
module.exports = {
	name: 'help',
	description: 'Vypíše seznam všech příkazů nebo podrobné informace o jednom příkazu',
	aliases: ['commands', 'hlp'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Tady je seznam všech příkazů:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nMůžeš napsat \`${prefix}help [command name]\` aby jsi zjistil podrobnější informace k specifickému příkazu!`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('Poslal jsem ti DM se seznamem všech příkazů!');
				})
				.catch(error => {
					console.error(`Nebylo možné posla DM ${message.author.tag}.\n`, error);
					message.reply('Vypadá to, že ti nemůžu poslat DM');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('To není exsistující příkaz');
		}

		data.push(`**Jméno:** ${command.name}`);

		if (command.aliases) data.push(`**Aliasy:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Popis:** ${command.description}`);
		if (command.usage) data.push(`**Použití:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} vteřin`);

		message.channel.send(data, { split: true });
	},
};
