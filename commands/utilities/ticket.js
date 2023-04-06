const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('For working with tickets')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addSubcommand(subcommand => 
            subcommand
                .setName('create')
                .setDescription('Opens a new ticket.')
                .addUserOption(option => option.setName('user').setDescription('Add user that has access to ticket.').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription('Closes the ticket (no one except mods can see it)')
                .addChannelOption(option => option.setName('ticket').setDescription('Ticket channel to close').setRequired(true))),
	async execute(interaction) {

    }
}