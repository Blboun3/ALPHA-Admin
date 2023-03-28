const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Announces some message to specific channel.')
    .setDMPermission(false)
    .addChannelOption(option =>
        option
            .setName('chnl')
            .setDescription('Channel where to announce.')
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName('title')
            .setDescription('Title of the announcement.')
            .setRequired(true))
    .addStringOption(option =>
        option
            .setName("content")
            .setDescription('Content for the announcement.')
            .setRequired(true))
    .addBooleanOption(option =>
        option
            .setName('hide')
            .setDescription('If announcer\'s identity should remain secret')
            .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
        const chnl = await interaction.options.getChannel('chnl');
        const content = await interaction.options.getString('content');
        const title = await interaction.options.getString('title');
        const raw_hide = await interaction.options.getBoolean('hide');
        const hide = 0 ? raw_hide === null: false | raw_hide

        const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            .setColor('#8730A6')
            .setDescription(`${content.toString().replaceAll('\\n', '\n')}`)
            .setTimestamp()
            .setFooter({text: 'ALPHA Admin bot by Blboun3#0084'})

            if(hide != true){
                embed.setAuthor({name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL()});
            }

        await chnl.send({embeds: [embed]});
        
        await interaction.reply(`Your message was successfully announced!`);
	},
};
