const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
});
  }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kill')
		.setDescription('Kills the discord bot process. Only use if necessary.')
        .setDMPermission(true)
        .addIntegerOption(option =>
            option
                .setName("exit_code")
                .setDescription("With what exit code should process end.")
                .setMinValue(0)
                .setMaxValue(255)   
                .setRequired(false) 
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        const logger = interaction.client.logger;
        const code = await interaction.options.getInteger('exit_code');
        await interaction.reply({ content: "Process will exit soon.", ephemeral:true});
        if(code != null){
            logger.warn(`Kill command was called, process will now exit with code ${code}.`)
            await sleep(2000)
            process.exit(code) 
        } else {
            logger.warn(`Kill command was called, process will now exit.`)
            await sleep(2000)
            process.exit()
        }
	},
};