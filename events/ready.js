module.exports = {
    name: 'ready', // Funkce která proběhne, když se bot zapne
    once: true, // Proběhne pouze jednou
    execute(client, DB) {
    	var rolesEmbed = {
    		title: "Role:",
    		color: 0x15fc00,
    		description: "**🧮: Matematika** \nPro ty, které zajímá a baví matematika \n**💻: Programování** \nPro ty, které zajímá programování a počítače \n**🔋: Elektronika** \nPro ty, které zajímá elektronika a elektro 'bastlení \n**⚛️: Fyzika** \nPro ty, které zajímá fyzika "
    	};
    	DB.query(`SELECT configValue FROM configs WHERE configName="roles_channel"`, (err, result) => {
    		var channel = client.channels.cache.get(result[0].configValue);
    		const fetched = channel.messages.fetch({limit: 99}).then(fetched => {
    			channel.bulkDelete(fetched)
    		});
    		var msgID;
    		channel.send({embed: rolesEmbed}).then(sent => {
    				msgID = sent.id;
    				sent.react("🧮");
    				sent.react("💻");
    				sent.react("🔋");
    				sent.react("⚛️");
    				DB.query(`DELETE FROM configs WHERE configName="roles_msg"`, (err) => {
    					if(err) return undefined;
    				});
    				DB.query(`INSERT INTO configs(configName, configValue) VALUES ("roles_msg","${msgID}") `, (err) => {
    					if(err) throw err;
    				});
    			});
    	});
        console.log(`Ready! Logged in as ${client.user.tag}`); // Napíše do console že je online a svůj user.
    },
};