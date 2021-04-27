module.exports = {
    name: 'react', // Jméno
    description: 'Udělá reakční zprávu, jako je verifikace', // 
    usage: '<reactionID>',
    permissions: 'ADMINISTRATOR',
    timeout: 0,
    execute (message, args, DB) {
        if (args[0] == 1) {
            var embed = {
                color: 0x15fc00,
                title: "Ověření",
                description: "Pro ověření, že jste člověk, prosím napište svoje uživatelské jméno a svůj unikátní identifikátor ve formátu `ALPHA#5676` \nV případě jakýchkoliv problémů prosím kontaktujte <@!573080354567487499>"
            };
            message.channel.send({embed: embed});
            msessage.delete();
        }
        if(args[0] == 2){
            var embed = {
                color: 0x15dc00,
                title: "Role",
                description:"**🧮: Matematika** \nPro ty, které zajímá matematika \n**💻: Programování** \nPro ty, které zajímá programování a počítače \n**🔋: Elektronika** \nPro ty, které zajímá elektronika a elektro bastlení \n**⚛️: Fyzika** \nPro ty, které zajímá fyzika"
            }
            message.channel.send({embed: embed}).then(sent => {
                sent.react("🧮")
                    .then(() => sent.react("💻"))
                    .then(() => sent.react("🔋"))
                    .then(() => sent.react("⚛️"))
                    .catch(() => console.error("One or more emojis failed to react"));
            });
            message.delete();
        }
    }
};