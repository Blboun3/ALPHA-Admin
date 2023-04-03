const {Events} = require('discord.js');
const { verified_role } = require('../public_config.json')
const application_request_processor = require('./hlp_application_request');
const role_selector = require('./hlp_role_selector');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

        // Verification
        if(interaction.customId === 'verification_btn'){
            interaction.member.roles.add(verified_role);
            await interaction.reply({content: "Verifikace proběhla úspěšně!", ephemeral: true});
            return 
        }

        // Role application request
        if((interaction.customId === 'application_request_dif' || interaction.customId === 'application_request_vip' || interaction.customId === 'application_request_mod' || interaction.customId === 'application_request_hlp')){
            application_request_processor.execute(interaction);
            return;
        }
    
        // Public role selector
        if(interaction.customId === 'public_role_selector') {
            role_selector.execute(interaction);
            return;
        }
    
        // Command processing
        // Check if command is in commands list
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
    
        // Try processing the commnd
        try {
            await command.execute(interaction);
        // Error handling
        } catch (error) {
            console.error(error);
            // Check for current interaction status and respond accordingly
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
	},
};