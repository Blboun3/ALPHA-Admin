const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, TextInputBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('apply')
		.setDescription('Sends application to admin team for some special request.')
        .setDMPermission(false)
        .addSubcommand(subcommand => 
            subcommand
                .setName('vip')
                .setDescription('Application for VIP role'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('mod')
                .setDescription('Application for MOD role'))
        .addSubcommand(subcommand =>
                subcommand
                    .setName('different')
                    .setDescription('Application for other role (possibly custom)'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('helper')
                .setDescription('Application for any of the helper roles.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
	async execute(interaction) {
        // Jméno
        const name = new TextInputBuilder()
            .setCustomId('applicant_name')
            .setLabel("Jméno")
            .setMaxLength(500)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        // Důvody
        const reasons = new TextInputBuilder()
            .setCustomId('applicant_reasons')
            .setLabel(`Proč bychom vám měli roli udělit?`)
            .setMaxLength(2000)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);
        // Název speciální role + popis
        const cust_role = new TextInputBuilder()
            .setCustomId('applicant_cust_role')
            .setLabel('Popis vaší role')
            .setMaxLength(2000)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);
        // Zájmy
        const focuses = new TextInputBuilder()
            .setCustomId('applicant_focuses')
            .setLabel('Vaše zájmy na tomto serveru ?')
            .setMaxLength(2000)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);
        
        if(interaction.options.getSubcommand() === 'different'){
            // In case of 'different' request 
            const modal = new ModalBuilder()
                    .setCustomId('application_request_dif')
                    .setTitle('Žádost o roli');
            const firstActionRow = new ActionRowBuilder().addComponents(name);
            const secondActionRow = new ActionRowBuilder().addComponents(reasons);
            const thirdActionRow = new ActionRowBuilder().addComponents(cust_role);
            const fourthActionRow = new ActionRowBuilder().addComponents(focuses);

            modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);
            return await interaction.showModal(modal);
        } else if(interaction.options.getSubcommand === 'vip' || interaction.options.getSubcommand() === 'mod') {
            // For VIP and MOD applications
            if(interaction.options.getSubcommand() === 'vip'){
                const modal = new ModalBuilder()
                    .setCustomId('application_request_vip')
                    .setTitle('Žádost o roli');
                const firstActionRow = new ActionRowBuilder().addComponents(name);
                const secondActionRow = new ActionRowBuilder().addComponents(reasons);
                const thirdActionRow = new ActionRowBuilder().addComponents(focuses);
    
                modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
                return await interaction.showModal(modal);
            } else {
                const modal = new ModalBuilder()
                    .setCustomId('application_request_mod')
                    .setTitle('Žádost o roli');
                const firstActionRow = new ActionRowBuilder().addComponents(name);
                const secondActionRow = new ActionRowBuilder().addComponents(reasons);
                const thirdActionRow = new ActionRowBuilder().addComponents(focuses);
    
                modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
                return await interaction.showModal(modal);
            }
        } else if (interaction.options.getSubcommand() === 'helper') {
                const modal = new ModalBuilder()
                    .setCustomId('application_request_hlp')
                    .setTitle('Žádost o roli');
                
                const roleSelector = new TextInputBuilder()
                    .setCustomId('applicant_role_select')
                    .setLabel('Pro jaký obor ?')
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(200)
                    .setRequired(true)

                const firstActionRow = new ActionRowBuilder().addComponents(name);
                const insertedActionRow = new ActionRowBuilder().addComponents(roleSelector)
                const secondActionRow = new ActionRowBuilder().addComponents(reasons);
                const thirdActionRow = new ActionRowBuilder().addComponents(focuses);
    
                modal.addComponents(firstActionRow, insertedActionRow, secondActionRow, thirdActionRow);
                return await interaction.showModal(modal);
        }
                
	},
};
