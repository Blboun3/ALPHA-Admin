module.exports = {
	name: 'help', // Jméno
	description:
		'Vypíše seznam všech příkazů nebo podrobné informace o jednom příkazu', // Popis
	aliases: ['commands', 'hlp'], // Aliasi
	usage: '[command name]', // použití
	cooldown: 5, // Cooldown
	execute(message, args) {
		// Spuštění
		const data = []; // Data [] prázndé pole
		const { commands } = message.client; // Not sure about that

		if (!args.length) {
			// pokud nejsou argumenty
			if (message.channel.type === 'dm') {
				data.push('**Tady je seznam všech příkazů:**\n');
				data.push(commands.map((command) => command.name).join(', ')); // ? IDK
			} else {
				data.push(
					`**Tady je seznam všech příkazů, které můžeš používat na serveru ${message.guild.name}: **\n`
				);
				const authorPerms = message.channel.permissionsFor(message.author); // Permissions autora
				let tmp = [];
				commands.forEach((command) => {
					if (authorPerms.has(command.permissions)) {
						tmp.push('`' + command.name + '` - ' + command.description + '\n');
					}
				});
				data.push(tmp.toString().replace(/,/g, ''));
			}
			data.push(
				`\n**Můžeš napsat \`${__prefix}help [command name]\` aby jsi zjistil podrobnější informace k specifickému příkazu!**`
			);

			var embed = {
				color: 0x15fc00,
				title: 'Příkazy',
				description: `${data.toString().trim().replace(/,/g, '')}`,
			};
			return message.author
				.send({embed: embed})
				.then(() => {
					if (message.channel.type === 'dm') return; // Napsání do DM
					message.reply('Poslal jsem ti DM se seznamem všech příkazů!');
				})
				.catch((error) => {
					console.error(
						`Nebylo možné posla DM ${message.author.tag}.\n`,
						error
					); // Napsáíní erroru
					message.reply('Vypadá to, že ti nemůžu poslat DM');
				});
		}

		const name = args[0].toLowerCase(); // pokud je argumenty
		const command =
			commands.get(name) ||
			commands.find((c) => c.aliases && c.aliases.includes(name)); // Zpracování

		if (!command) {
			return message.reply('To není exsistující příkaz'); // Error, pokud příkaz neexsistuje
		}

		if (command.aliases) data.push(`**Aliasy:** ${command.aliases.join(', ')}\n`);
		if (command.description) data.push(`**Popis:** ${command.description}\n`);
		if (command.usage)
			data.push(`**Použití:** ${__prefix}${command.name} ${command.usage}\n`);

		data.push(`**Cooldown:** ${command.cooldown || 3} vteřin\n`);

		var embed = {
			color: 0x15fc00,
			title: `Informace o příkazu "${command.name}":`,
			description: `${data.toString().trim().replace(/,/g, '')}`,
		};

		message.channel.send({embed: embed});
	},
};
