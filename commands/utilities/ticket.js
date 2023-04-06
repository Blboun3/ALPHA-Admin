const { SlashCommandBuilder, codeBlock, PermissionFlagsBits, inlineCode } = require('discord.js');
var table = require('text-table');

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
                .addUserOption(option => option.setName('user').setDescription('Add user that has access to ticket.').setRequired(true))
                .addStringOption(option => option.setName('name').setDescription('Name of the ticke channel. Must be unique!').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription('Closes the ticket (no one except mods can see it)')
                .addStringOption(option => option.setName('ticket').setDescription('Ticket channel to close').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Lists all tickets from DB')
                .addBooleanOption(option => option.setName('public').setDescription('Should the output of this command be publicly visible.')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('find')
                .setDescription('Find ticket by channel name')
                .addStringOption(option => option.setName('channel-name').setDescription('Name of the channel of the ticket').setRequired(true))
                .addBooleanOption(option => option.setName('public').setDescription('Should the output of this command be publicly visible.'))),

	async execute(interaction) {
        // Get logger
        const logger = interaction.client.logger;

        // Ticket create
        if(interaction.options.getSubcommand() == 'create') {
            await interaction.deferReply({ephemeral: true})
            // Load all the data
            const TicketSystem = interaction.client.TicketSystem;
            const chnl_name = interaction.options.getString('name');
            const user_id = interaction.options.getUser('user').id;
            
            // Create ticket
            const response = await TicketSystem.createTicket(user_id,chnl_name);

            logger.info(`Created ticket. TS.CreateTicket response is ${response}`);
            // Respond so that discord isn't being annoying
            switch(response){
                case -1:
                    await interaction.editReply({content: `Unable to create ticket named ${chnl_name} with user <@${user_id}> due to UUID error. Please try again.`, ephemeral:true});
                    break;
                case 0:
                    await interaction.editReply({content: `Unable to create ticket named ${chnl_name} with user <@${user_id}> due to uknown error. Please try again later or contact administrator.`, ephemeral:true});
                    break;
                default:
                    await interaction.editReply({content: `Successfully created ticket named ${chnl_name} with user <@${user_id}>. Ticket has UUID ${response} `, ephemeral:true});
                    break;
            }
            return;
        
        // Ticket list
        } else if (interaction.options.getSubcommand() == 'list') {
            // Process publicity of response
            var public = interaction.options.getBoolean('public');
            if(public == true){
                public = false
            } else {
                public = true
            }
            await interaction.deferReply({ephemeral: public})

            // Load constants
            const Tickets = interaction.client.DB.tickets;
            const ticketsList = await Tickets.findAll({ attributes: ['ticketID', 'memberID', 'channelName', 'open'] });
            
            // Get all and process them to table
            var dataTable = [["Channel Name", "Member", "Open", "UUID"]];
            ticketsList.forEach(element => {
                var thisArr = [element.dataValues.channelName, element.dataValues.memberID, element.dataValues.open, element.dataValues.ticketID]
                dataTable.push(thisArr);
            });
            const t = table(dataTable);
            // Respond
            interaction.editReply({content: `${codeBlock(t)}`, ephemeral: public});

        // Ticket Close
        } else if (interaction.options.getSubcommand() == 'close'){
            await interaction.deferReply({ephemeral: true})
            // Load constants
            const TicketSystem = interaction.client.TicketSystem;
            const tckt_uuid = interaction.options.getString('ticket');

            // Process ticket closing
            const response = await TicketSystem.closeTicket(tckt_uuid);
            
            logger.info(`Closed ticket. TS.CreateTicket response is ${response}`);
            // Respond so that discord isn't being annoying
            switch(response){
                case 1:
                    await interaction.editReply({content: `Successfully closed ticket with UUID ${tckt_uuid}.`, ephemeral:true});
                    break;
                case -1:
                    await interaction.editReply({content: `Ticket with UUID ${tckt_uuid} doesn't exist.`, ephemeral:true});
                    break;
                case -2:
                    await interaction.editReply({content: `An unknown error occured while fetching the thread.Please try again later.`, ephemeral:true});
                    break;
                case 0:
                    await interaction.editReply({content: `An unknown error happened while updating thread start. Pleas try again later.`, ephemeral:true});
            }
            return;

        // Ticket find
        } else if (interaction.options.getSubcommand() == 'find'){
            // Process publicity of the response
            var public = interaction.options.getBoolean('public');
            if(public == true){
                public = false
            } else {
                public = true
            }
            await interaction.deferReply({ephemeral: public})
            // Load constants
            const Tickets = interaction.client.DB.tickets;
            const chnl_name = interaction.options.getString('channel-name');

            // Search and process results to table
            const tickets = await Tickets.findAll({attributes: ['ticketID', 'memberID', 'channelName', 'open'], where: { channelName: chnl_name.toUpperCase() } });        

            // If no results found
            if(tickets == undefined || tickets.length == 0) {
                interaction.editReply({content: `There are no results for: ${inlineCode(chnl_name)}`, ephemeral: public});    
                return;
            }
            var dataTable = [["Channel Name", "Member", "Open", "UUID"]];
            tickets.forEach(element => {
                var thisArr = [element.dataValues.channelName, element.dataValues.memberID, element.dataValues.open, element.dataValues.ticketID]
                dataTable.push(thisArr);
            });
            const t = table(dataTable);
            // Reply
            interaction.editReply({content: `Search query for tickets with channel name: ${inlineCode(chnl_name)} ${codeBlock(t)}`, ephemeral: public});
            return;
        }
    }
}