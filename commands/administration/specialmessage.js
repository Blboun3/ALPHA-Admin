const { ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('specialmessage')
		.setDescription('Creates a special message.')
        .setDMPermission(false)
        .addSubcommand(subcommand => 
            subcommand
                .setName('roles')
                .setDescription('Create a message for picking roles.')
                .addStringOption(option => option.setName('text').setDescription('Text prompt above the selection itself').setRequired(true))
                .addChannelOption(option => option.setName('chnl').setDescription('In which channel should the message with the selection be sent in.').setRequired(true).addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rules')
                .setDescription('General rules message.')
                .addChannelOption(option => option.setName('chnl').setDescription('In which channel should the message with the selection be sent in.').setRequired(true).addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText)))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        // Rules option selected
        if(interaction.options.getSubcommand() === 'rules'){
            // Get channel from command
            const chnl = interaction.options.getChannel('chnl');
            // Rules in Czech
            const embed_cz = new EmbedBuilder()
                .setTitle('Pravidla')
                .setColor('#00ff05')
                .setDescription(`1.) Dodržuj https://discord.com/terms\n2.)Žádné spamování zprávamí ani reakcemi není povoleno\n3.) Bezdůvodné pingování kohokoliv (=členů i skupin) není povoleno\n4.) Žádný NSFW, 18+ nebo nechutný či nevhodný obsah není povolen\n5.) Držte se témat kanálů\n6.) <@&797846893144571924> a <@&797847091849330738> mají vždycky poslední slovo\n7.) Žádné urážlivé či nevhodné přezdívky, jména, ani profilovky\n8.) Žádná reklama (pouze po dohodě s Adminem)\n9.) Žádné vulgarismy a to v žádném jazyce (běžně užívané zkratky jsou povoleny, ale nepřehánějte to s nimi)\n10.) Žádné alt účty bez domluvy s Adminem\n11.) Respektujte se\n12.) Žádné nabídky úplaty za pomoc, řešení financí, požadování úplaty za pomoc apod.\n13.) Bezdůvodné prošení o role (VIP, MOD)\n\n**Tato pravidla se mohou kdykoliv měnit**\nV případě jakýchkoliv nejasností prosím kontaktujte Adminy`)
                .setTimestamp()
                .setFooter({text: 'ALPHA Admin bot by Blboun3#0084'})
                .setAuthor({ name: "ALPHA Admin Team", iconURL: 'https://cdn.discordapp.com/avatars/797862942036721664/ffc64d41e14d5d913c8a543dc4024cef.webp'})
            // Rules in English
            const embed_en = new EmbedBuilder()
                .setTitle('Rules')
                .setColor('#006d01')
                .setDescription(`1.) Follow https://discord.com/terms\n2.) No spamming of messages or reactions is allowed\n3.) Unnecessary pinging of anyone (members or groups) is not allowed\n4.) No NSFW, 18+ or disgusting or inappropriate content is allowed\n5.) Stick to the channel topics\n6.) <@&797846893144571924> and <@&797847091849330738> always have the final word\n7.) No offensive or inappropriate nicknames, names, or profile pictures\n8.) No advertising (only with agreement from Admin)\n9.) No vulgar language in any language (commonly used abbreviations are allowed, but don't overdo it)\n10.) No alt accounts without agreement from Admin\n11.) Respect each other\n12.) No offers of payment for help, financial solutions, demanding payment for help, etc.\n13.) Unnecessary asking for roles (VIP, MOD)\n\n**These rules can change at any time**\nIf you have any questions, please contact the Admins.\n\n*Please note that this server is dedicated to the Czech language, and we kindly ask that all messages be written in Czech or Slovak.*`)
                .setTimestamp()
                .setFooter({text: 'ALPHA Admin bot by Blboun3#0084'})
                .setAuthor({ name: "ALPHA Admin Team", iconURL: 'https://cdn.discordapp.com/avatars/797862942036721664/ffc64d41e14d5d913c8a543dc4024cef.webp'})
            // Send to selected channel
            chnl.send({embeds: [embed_cz, embed_en]})
            // Reply to original interaction so it doesn't fail
            interaction.reply('Rules were sent to your desired channel.')
        } else if (interaction.options.getSubcommand() === 'roles'){
            // Get channel from command
            const chnl = interaction.options.getChannel('chnl');
            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('public_role_selector')
                        .setPlaceholder('Prosím vyberte')
                        .setMaxValues(6)
                        .setMinValues(1)
                        .addOptions([
                            {label: "Matematika", description: "Pro ty, které zajímá matematika", value:"797851116935184384"},
                            {label: 'Programování', description: "Pro ty, které zajímá programování a počítače", value: "797851517222125590"},
                            {label: "Elektronika", description: "Pro ty, které zajímá elektronika a elektro bastlení", value: '797851702292119583'},
                            {label: "Fyzika", description: "Pro ty, které zajímá fyzika", value:""}
                        ])
                )
        }

	},
};
