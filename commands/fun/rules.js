const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('Sends user server rules as ephemeral.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
	async execute(interaction) {
        const embed_cz = new EmbedBuilder()
            .setTitle('Pravidla')
            .setColor('#00ff05')
            .setDescription(`1.) Dodržuj https://discord.com/terms\n2.)Žádné spamování zprávamí ani reakcemi není povoleno\n3.) Bezdůvodné pingování kohokoliv (=členů i skupin) není povoleno\n4.) Žádný NSFW, 18+ nebo nechutný či nevhodný obsah není povolen\n5.) Držte se témat kanálů\n6.) <@&797846893144571924> a <@&797847091849330738> mají vždycky poslední slovo\n7.) Žádné urážlivé či nevhodné přezdívky, jména, ani profilovky\n8.) Žádná reklama (pouze po dohodě s Adminem)\n9.) Žádné vulgarismy a to v žádném jazyce (běžně užívané zkratky jsou povoleny, ale nepřehánějte to s nimi)\n10.) Žádné alt účty bez domluvy s Adminem\n11.) Respektujte se\n12.) Žádné nabídky úplaty za pomoc, řešení financí, požadování úplaty za pomoc apod.\n13.) Bezdůvodné prošení o role (VIP, MOD)\n\n**Tato pravidla se mohou kdykoliv měnit**\nV případě jakýchkoliv nejasností prosím kontaktujte Adminy`)
            .setTimestamp()
            .setFooter({text: 'ALPHA Admin bot by Blboun3#0084'})
            .setAuthor({ name: "ALPHA Admin Team", iconURL: 'https://cdn.discordapp.com/avatars/797862942036721664/ffc64d41e14d5d913c8a543dc4024cef.webp'})
        await interaction.reply({embeds: [embed_cz], ephemeral: true})
	},
};
