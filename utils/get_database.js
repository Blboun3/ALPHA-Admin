const Sequelize = require('sequelize');
const { DB_user, DB_pass } = require('../config.json');
const { DB_name, DB_dialect, DB_host, DB_storage } = require('../public_config.json');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    name: "get_database",
    async execute(force=false) {
        // Create DB object
        const sequelize = new Sequelize(DB_name, DB_user, DB_pass, {
            host: DB_host,
            dialect: DB_dialect,
            logging: false,
            // SQLite only
            storage: DB_storage,
        });

        // Tickets
        const Tickets = sequelize.define('tickets', {
            // Internal ticket's id
            ticketID: {type: Sequelize.UUIDV4, defaultValue: function() {return uuidv4();},unique: true, allowNull: false, primaryKey: true},
            // ID of channel
            channelID: {type: Sequelize.STRING, allowNull: false},
            // ID of member that created the ticked
            memberID: {type: Sequelize.STRING, allowNull: false},
            // Visible name of channel (not sure if neede)
            channelName: {type: Sequelize.STRING, allowNull: false},
            // If the ticket is open i.e. should the user be able to see the channel
            open: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true}

        });

        // Table containing all the warns given to member
        const Warns = sequelize.define('warns', {
            // Who's gotten a warn
            memberID: {type: Sequelize.STRING, allowNull:false},
            // Why have they gotten a warn
            description: {type: Sequelize.STRING},
            // Who has issued the warn
            warnAuthor: {type: Sequelize.STRING, allowNull: false}
        });

        // Remember user's roles when he leaves server, this will prevent someone from leaving and joining again to bypass some role blocks (like role mute)
        const leaveRoles = sequelize.define('leave_roles', {
            // Member that has left, also each member should be alowed only one row in this table
            memberID: {type: Sequelize.STRING, allowNull: false, unique: true, primaryKey: true},
            roles: {type: Sequelize.STRING(3072)}
        })

        // Sync all tables
        Tickets.sync(force);
        Warns.sync(force);
        leaveRoles.sync(force);

        return {tickets: Tickets, warns: Warns, leave_roles: leaveRoles}
    }
}

