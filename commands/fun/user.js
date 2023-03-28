const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Sends informations about specified user.')
        .setDMPermission(true)
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User that you want to get info about.')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
	async execute(interaction) {
        const usr = await interaction.options.getUser('user');
        var aboutUser = usr;
        if(usr === null){
            // Provide informations about user who called the function
            aboutUser = interaction.user
        }
        const info = {
            'username' : aboutUser.username,
            'discriminator' : aboutUser.discriminator,
            'id' : aboutUser.id,
            'pfp' : aboutUser.avatarURL(),
            'createdAt' : new Date(Date.parse(aboutUser.createdAt)).toUTCString(),
            'age' : new Date((Date.now() - Date.parse(aboutUser.createdAt))),
            'accentColor' : aboutUser.accentColor
        };

        const embed = new EmbedBuilder()
            .setTitle(`\`${info.username}#${info.discriminator}\` info`)
            .setDescription(`Username: \`${info.username}\`\nDiscriminator: \`${info.discriminator}\`\nID: \`${info.id}\`\nAccount created at: \`${info.createdAt}\`\nAccent color: \`${info.accentColor}\`\nPFP link: [${info.pfp}](${info.pfp})`)
            .setThumbnail(info.pfp)
            .setTimestamp()
            .setColor('#EFAD7B')
            .setFooter({text: 'ALPHA Admin bot by Blboun3#0084'})

        await interaction.reply({embeds: [embed], ephemeral: true})
	},
};
