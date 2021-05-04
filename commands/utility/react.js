module.exports = {
    name: 'react', // Jméno
    description: 'Udělá reakční zprávu, jako je verifikace', // 
    usage: '<reactionID>',
    permissions: 'ADMINISTRATOR',
    timeout: 0,
    execute (message, args, DB) {
        if (args[0] == 1) { // Verifikace
            var embed = {
                color: 0x15fc00,
                title: "Ověření",
                description: "Pro ověření, že jste člověk, prosím napište svoje uživatelské jméno a svůj unikátní identifikátor ve formátu `ALPHA#5676` \nV případě jakýchkoliv problémů prosím kontaktujte <@!573080354567487499>"
            };
            message.channel.send({embed: embed});
            msessage.delete();
        }
        if(args[0] == 2){ // Role
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
        if(args[0] == 3){ // Pravidla a informace
            var embed = {
                color: 0x15dc00,
                title: "Pravidla",
                description: "1.) Dodržuj https://discord.com/terms\n" + "2.)Žádné spamování zprávamí ani reakcemi není povoleno\n" + "3.) Bezdůvodné pingování kohokoliv (=členů i skupin) není povoleno\n" + "4.) Žádný NSFW, 18+ nebo nechutný či nevhodný obsah není povolen\n" + "5.) Držte se témat kanálů\n" + "6.) <@&797846893144571924> a <@&797847091849330738> mají vždycky poslední slovo\n" + "7.) Žádné urážlivé či nevhodné přezdívky, jména, ani profilovky\n" + "8.) Žádná reklama (pouze po dohodě s Adminem)\n" + "9.) Žádné vulgarismy a to v žádném jazyce (běžně užívané zkratky jsou povoleny, ale nepřehánějte to s nimi)\n" + "10.) Žádné alt účty bez domluvy s Adminem\n" + "11.) Respektujte se\n" + "12.) Žádné nabídky úplaty za pomoc, řešení financí, požadování úplaty za pomoc apod.\n" + "13.) Bezdůvodné prošení o role (VIP, MOD) \n\n" + "**Tato pravidla se mohou kdykoliv měnit** \n" + "*V případě jakýchkoliv nejasností prosím kontaktujte Adminy*"
            };
            message.channel.send({embed: embed});
            message.delete();
        }
    }
};