const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        if (!(interaction.isChatInputCommand() || interaction.isModalSubmit() || interaction.isStringSelectMenu())) return;
        //console.log(interaction);
    
        // Modal submit => role application request
        if(interaction.isModalSubmit()){
            // If it isn't application_request
            if(!(interaction.customId === 'application_request_dif' || interaction.customId === 'application_request_vip' || interaction.customId === 'application_request_mod' || interaction.customId === 'application_request_hlp')) return;
            
            // Try processing the request
            try {
                // Pre-create embed
                const embed = new EmbedBuilder()
                .setColor('#B35609')
                .setTitle(`Žádost o roli ${interaction.customId.split('_')[2]}`)
                .setTimestamp()
                .setFooter({text: 'ALPHA Admin bot by Blboun3#0084'})
    
            // Different embed descriptions depending on request type
            if(interaction.customId === 'application_request_dif'){
                embed.setDescription(`Uživatel podal žádost o roli.\n\n**Jméno:**${interaction.fields.getTextInputValue('applicant_name')}\`\n**Uživatel:** <@${interaction.user.id}>\n**Vlastní role:** \`\`\`${interaction.fields.getTextInputValue('applicant_cust_role')}\`\`\`\n**Důvody proč mu roli udělit:** \`\`\`${interaction.fields.getTextInputValue('applicant_reasons')}\`\`\`\n**Jeho zájmy na tomto serveru:** \`${interaction.fields.getTextInputValue('applicant_focuses')}\``)
            } else if(interaction.customId === 'application_request_mod' || interaction.customId === 'application_request_vip') {
                embed.setDescription(`Uživatel podal žádost o roli.\n\n**Jméno:**\`${interaction.fields.getTextInputValue('applicant_name')}\`\n**Uživatel:** <@${interaction.user.id}>\n**Důvody proč mu roli udělit:** \`\`\`${interaction.fields.getTextInputValue('applicant_reasons')}\`\`\`\n**Jeho zájmy na tomto serveru:** \`\`\`${interaction.fields.getTextInputValue('applicant_focuses')}\`\`\``)
            } else {
                embed.setDescription(`Uživatel podal žádost o roli.\n\n**Jméno:**\`${interaction.fields.getTextInputValue('applicant_name')}\`\n**Uživatel:** <@${interaction.user.id}>\n**Kategorie:**\`\`\`${interaction.fields.getTextInputValue('applicant_role_select')}\`\`\`\n**Důvody proč mu roli udělit:** \`\`\`${interaction.fields.getTextInputValue('applicant_reasons')}\`\`\`\n**Jeho zájmy na tomto serveru:** \`\`\`${interaction.fields.getTextInputValue('applicant_focuses')}\`\`\``)
            }
    
            // Get channel where to send request
            interaction.guild.channels.cache.get(application_requests).send({embeds: [embed]})
    
            // Error handling
            } catch (error) {
                console.log(error)
                await interaction.reply({content: "Vaši žádost se bohužel nepodařilo odeslat, zkuste to prosím později.\nDěkujeme vám za zájem!", ephemeral: true})
                return;
            }
            // If everything went ok => respond with ok ( XD )
            await interaction.reply({content: "Vaše žádost byla úspěšně odeslána.\nDěkujeme vám za zájem!", ephemeral: true})
        }
    
        // String menu selection
        if(interaction.isStringSelectMenu()) {
            // Role selector
            if(!interaction.customId === 'public_role_selector') return;
            // Get user roles and selected roles
            const userRoles = interaction.member.roles;
            const roles = interaction.values;
    
            // If it includes 1 => None - remove all roles
            if(roles.includes("1")){
                // Remove all roles from the user
                allRoles.forEach(element => {
                    // Check if user has the role
                    if(userRoles.cache.has(element)){
                        userRoles.remove(element);
                    }
                });
                await interaction.reply({ content: "Vaše role byly aktualizovány", ephemeral: true});
                return;
            }
    
            // If it doesn't include 1 => user wants to change his roles
            // Go thru all roles
            allRoles.forEach(element => {
                // If user already has role
                if(userRoles.cache.has(element)){
                    // If selected roles includes the role -> user wants that role
                    if(roles.includes(element)) return;
                    // Otherwise user doesn't want that role
                    userRoles.remove(element)
                } else {
                    // User doesn't have the role
                    // Does he want it ?
                    if(!roles.includes(element)) return;
                    // If yes than give it to him
                    userRoles.add(element);
                }
            });
            await interaction.reply({content: "Vaše role byly aktualizovány.", ephemeral: true})
            
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