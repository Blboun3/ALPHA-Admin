const { ChannelType } = require('discord.js');
const { v4:uuidv4 } = require('uuid');

class TicketSystem {
    constructor(client){
        this.client = client;
        this.Tickets = client.DB.tickets;
        this.ticket_channel_ID = client.config.ticket_channel;
        this.guildId = client.config.guildId;
        this.ticket_webhook = client.config.ticket_channel_webhook;
        this.logger = client.logger;
    }
    
    // Function to create new ticket with user
    async createTicket(user, visible_name){
        // Get guild and channel
        this.guild = await this.client.guilds.fetch(this.guildId);
        this.ticket_channel = await this.guild.channels.fetch(this.ticket_channel_ID);

        // Generate Unique UUID
        const uuid = uuidv4();

        // Create thread
        const thread = await this.ticket_channel.threads.create({
            name: visible_name,
            autoArchiveDuration: 60,
            reason: `Ticket id: ${uuid}`,
            type: ChannelType.PrivateThread,
            invitable: false

        });
        // Save thread ID
        const threadID = thread.id;

        // Add people
        // Add user
        await thread.members.add(user);
        // Add admins
        this.guild.roles.cache.get(this.client.config.adminID).members.forEach(async element => {
            await thread.members.add(element.id);
        });
        // Add mods
        this.guild.roles.cache.get(this.client.config.modID).members.forEach(async element => {
            await thread.members.add(element.id);
        })

        // Save all to DB
        try {
            const ticket = this.Tickets.create({
                ticketID: uuid,
                channelID: threadID,
                memberID: user,
                channelName: visible_name.toUpperCase(),
                open: true
            });
        } catch (error) {
            if(error.name === 'SequelizeUniqueConstraintError') {
                this.logger.error('Ticket with that UUID already exists.')
                return -1
            } else {
                const child = this.logger.child({error: error});
                child.error('An unexpected error occured.');
                return 0
            }
        }
        return uuid;

    }

    // Function to close ticket (i.e. lock and archive thread)
    async closeTicket(uuid){
        // Get ticket ID
        const ticket = await this.Tickets.findOne({ where: {ticketID: uuid}});
        if(ticket === null){
            this.logger.error(`Cannot find ticket with id ${uuid}`);
            return -1
        }
        const ticketID = ticket.channelID;
        // Get guild and channel
        this.guild = await this.client.guilds.fetch(this.guildId);
        this.ticket_channel = await this.guild.channels.fetch(this.ticket_channel_ID);
        // Try to fetch the thread
        var thread;
        try {
            thread = await this.ticket_channel.threads.fetch(ticketID);   
        } catch (error) {
            const childs = this.logger.child({error: error});
            childs.error('An error occured while fetching thread.');
            return -2;
        }
        // Lock and archive the thread
        try {
            thread.setLocked(true);
            thread.setArchived(true);
            await this.Tickets.update({ open: false }, { where: {ticketID: uuid}});
        } catch (error) {
            const child=this.logger.child({error: error})
            child.error('An error occured')
            return 0;
        }
        return 1
    }
}

module.exports = TicketSystem;