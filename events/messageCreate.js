const {Events} = require('discord.js');
const { counting_channel, counting_function} = require('../public_config.json');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Get channel in which message was sent
        const chnl = message.channel;

        // Check if channel is announcements channel (automatically post all announcements)
        if(chnl.type === 5){
            message.crosspost();
        }

        // Channel with counting
        if(chnl.id == counting_channel) {
            if(message.author.bot) return
            // Load last 3 messages
            const mesgs = await chnl.messages.fetch({ limit: 3});
            // Get iterator
            const iter = mesgs.keys()
            // Skip the last one for now as it is one sent by user
            iter.next();

            // Last message
            const l_msg = mesgs.get(iter.next().value)
            // Author of last message to check if they haven't this message too
            const l_auth = l_msg.author.id;

            // Make sure that user didn't write last number too
            if(l_auth == message.author.id) {
                message.delete("Psal číslo předtím!")
                return
            }

            // Create function from public_config configuration
            c_fce = new Function(counting_function.arguments, counting_function.body);

            l_msg.reactions.cache.forEach(element => {
                // Check if prev. message has 🚫 emoji
                if(element.emoji.name == '🚫'){
                    f_val = c_fce(0,0)
                    // Check if values match
                    if(message.content.replace(/\D/g,"") == f_val || message.content.includes(f_val)){
                        message.react('✅');
                    } else {
                        message.react('🚫');
                    }
                    return 0;
                }
            });

            // Load last 2 number sent before this message
            var n1 = l_msg.content.replace(/\D/g,"")
            try { BigInt(n1) } catch(error) { n1 = 0; }
            var n2 = mesgs.get(iter.next().value).content.replace(/\D/g,"");
            try { BigInt(n2) } catch(error) { n2 = 0; }

            // Calculate next correct value using that function
            f_val = c_fce(n1,n2);

            // Check if values match
            if(message.content.replace(/\D/g,"") == f_val || message.content.includes(f_val)){
                message.react('✅');
            // If not
            } else {
                message.reply(`Upss, <@${message.author.id}>, vypadá to, že jsi to pokazil!\nJedeme od začátku - první číslo je 1.`)
                message.react('🚫');
                return
            }

        } 
    },
}