const {allRoles } = require('../public_config.json');
const logger = require('../utils/logger');

module.exports = {
    name: "role_selector",
    async execute(interaction) {
        try {
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
        } catch (error) {
            const child = logger.child({error: error.toString()})
            child.error(`Unable to change roles for user ${interaction.member.id}`)
            await interaction.reply({content: "Nepodařilo se aktualizovat vaše role, zkuste to prosím znovu později.", ephemeral: true}) 
            return;
        }

        logger.info(`Changed roles for user ${interaction.member.id}`)
        await interaction.reply({content: "Vaše role byly aktualizovány.", ephemeral: true}) 
        return;
    }
}