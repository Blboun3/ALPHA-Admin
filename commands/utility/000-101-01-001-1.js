module.exports = {
    name: 'secret', // Jméno
    description: 'Secret kódy', // 
    timeout: 0,
    args: true,
    usage: '<secret>',
    guildOnly: true,
    execute (message, args, DB) {
    	if(args[0] == "000-101-01-001-1"){
	        DB.query(`SELECT configValue FROM configs WHERE configName="skautRole"`, (err, res) => {
	        	let role = message.guild.roles.cache.find(role => role.id == res[0].configValue);
	        	message.member.roles.add(role);
	        });
	        message.delete();
    	}
    	message.delete();
    }
};