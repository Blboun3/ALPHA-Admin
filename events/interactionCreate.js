const { Events, AttachmentBuilder } = require('discord.js');
const application_request_processor = require('./hlp_application_request');
const { request } = require('undici');
const role_selector = require('./hlp_role_selector');
const Canvas = require('@napi-rs/canvas');
const { GlobalFonts } = require('@napi-rs/canvas');

// Pass the entire Canvas object because you'll need access to its width and context
const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 2}px JetBrainsMono`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - 320);

	// Return the result to use in the actual canvas
	return context.font;
};

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
        const logger = interaction.client.logger;
        const verified_role = interaction.client.config.verified_role;
        const welcome_channel = interaction.client.config.welcome_channel;
        // Verification
        if(interaction.customId === 'verification_btn'){
            // Give user verified role
            interaction.member.roles.add(verified_role);
            logger.debug(`User ${interaction.member.id} was verified`)
            // Get welcome channel (where to send message about his appearance)
            const chnl = interaction.guild.channels.cache.get(welcome_channel)
            
            // Process Image creation
            const font = GlobalFonts.registerFromPath('./font.ttf','JetBrainsMono');
            const canvas = Canvas.createCanvas(700, 250);
		    const context = canvas.getContext('2d');

            // Draw background image
            const bg = await Canvas.loadImage('./welcome_background.jpg')
            context.drawImage(bg, 0, 0, canvas.width, canvas.height);

            // Draw stroke around entire image
	        context.strokeStyle = '#0099ff'
        	context.strokeRect(0, 0, canvas.width, canvas.height);

            // Assign the decided font to the canvas
	        context.font = applyText(canvas, interaction.member.displayName);
	        context.fillStyle = '#ffffff';
	        context.fillText(`${interaction.member.displayName}!`, canvas.width / 2.5, canvas.height / 1.5);
            // Slightly smaller text placed above the member's display name
	        context.font = '28px JetBrainsMono';
	        context.fillStyle = '#ffffff';
	        context.fillText('Vítej na ALPHĚ,', canvas.width / 2.5, canvas.height / 2.5);

            // Process User's avatar
            // Using undici to make HTTP requests for better performance
	        const { body } = await request(interaction.user.displayAvatarURL({ extension: 'jpg' }));
	        const avatar = await Canvas.loadImage(await body.arrayBuffer());
            // Cut it to circle
            // Pick up the pen
	        context.beginPath();
        	// Start the arc to form a circle
	        context.arc(125, 125, 100, 0, Math.PI * 2, true);
	        // Put the pen down
        	context.closePath();
	        // Clip off the region you drew on
	        context.clip();
            // Place avatar on to the background
            context.drawImage(avatar, 25, 25, 200, 200);

            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: `welcome-user.png` });
            
            try {
                chnl.send({content: `Vítej na ALPHĚ, <@${interaction.user.id}> - největším českém matematicko-programátorském serveru!`, files: [attachment]})   
            } catch (error) {
                const child = logger.child({error: error.toString()})
                child.error("Error while sending welcome image")
            }

            // Reply to user that verification was successfull (also so that discord doesn't have any problems XD)
            await interaction.reply({content: "Verifikace proběhla úspěšně!", ephemeral: true});
            return 
        }

        // Role application request
        if((interaction.customId === 'application_request_dif' || interaction.customId === 'application_request_vip' || interaction.customId === 'application_request_mod' || interaction.customId === 'application_request_hlp')){
            application_request_processor.execute(interaction);
            return;
        }
    
        // Public role selector
        if(interaction.customId === 'public_role_selector') {
            role_selector.execute(interaction);
            return;
        }
    
        // Command processing
        // Check if command is in commands list
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
    
        // Try processing the commnd
        try {
            await command.execute(interaction);
        // Error handling
        } catch (error) {
            const child = logger.child({error: error.toString()})
            child.error(`Error occured during command execution.`)
            // Check for current interaction status and respond accordingly
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Ups, vypadá to, že se něco pokazilo, zkuste to prosím znovu později.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Ups, vypadá to, že se něco pokazilo, zkuste to prosím znovu později.', ephemeral: true });
            }
        }
	},
};