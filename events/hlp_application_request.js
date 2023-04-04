const {application_requests} = require('../public_config.json')
const logger = require('../utils/logger');

module.exports = {
    name: "application_request_processor",
    async execute(interaction) {
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
            const child = logger.child({error: error.toString()})
            child.error(`Unable to send application for role by user ${interaction.member.id}`)
            await interaction.reply({content: "Vaši žádost se bohužel nepodařilo odeslat, zkuste to prosím později.\nDěkujeme vám za zájem!", ephemeral: true})
            return;
        }
        // If everything went ok => respond with ok ( XD )
        logger.info(`Role application by user ${interaction.member.id} was sent successfuly`)
        await interaction.reply({content: "Vaše žádost byla úspěšně odeslána.\nDěkujeme vám za zájem!", ephemeral: true})
        return;
    }
}