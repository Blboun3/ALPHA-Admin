const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType} = require('discord.js');
const {generalFooter} = require('../../public_config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Announces some message to specific channel.')
    .setDMPermission(false)
    .addChannelOption(option =>
        option
            .setName('chnl')
            .setDescription('Channel where to announce.')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildAnnouncement, ChannelType.GuildText))
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
        
        // Load all the data
        const chnl = await interaction.options.getChannel('chnl');
        const content = await interaction.options.getString('content');
        const title = await interaction.options.getString('title');
        const raw_hide = await interaction.options.getBoolean('hide');
        const hide = 0 ? raw_hide === null: false | raw_hide

        // Build embed
        const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            .setColor('#8730A6')
            .setDescription(`${content.toString().replaceAll('\\n', '\n')}`)
            .setTimestamp()
            .setFooter({text: generalFooter})

            if(hide != true){
                embed.setAuthor({name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL()});
            }

        // Send embed
        try {
            await chnl.send({embeds: [embed]});   
        } catch (error) {
            return await interaction.reply('Ooops, it looks like I don\'t have permissions to write to that channel!')
        } 
        // Reply that action happened
        await interaction.reply(`Your message was successfully announced!`);
            
	},
};
