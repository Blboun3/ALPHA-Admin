const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('node:os');
const { version, version_name } = require('../package.json');

// Function that converts bytes into more human friendly units, used for showing how much RAM does system have
const convertBytes = function(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    if (bytes == 0) {
      return "n/a"
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))  
    if (i == 0) {
      return bytes + " " + sizes[i]
    }
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
  }

// Function to convert time in seconds to HH:MM:SS
const secondsToTime = function(g_seconds) {
    dateObj = new Date(g_seconds * 1000);
    hours = dateObj.getUTCHours();
    minutes = dateObj.getUTCMinutes();
    seconds = dateObj.getSeconds();

    timeString = hours.toString().padStart(2, '0') + ':' + 
        minutes.toString().padStart(2, '0') + ':' + 
        seconds.toString().padStart(2, '0');
    
        return timeString;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Replies with current status of the bot.'),
	async execute(interaction) {
        // Object holding all system info
        const info = {
            'cpu_arch' : os.machine(),
            'cpu_count' : os.cpus().length,
            'cpu_model' : os.cpus()[0].model,
            'os_type' : `${os.type} : ${os.platform()}`,
            'os_version' : os.release(),
            'os_memory' : convertBytes(os.totalmem()),
            'uptime' : secondsToTime(os.uptime()),

        };
        // Building embed to send
        const embed = new EmbedBuilder()
            .setColor(0x1EECD4)
            .setTitle("ALPHA Admin bot status")
            .setDescription("I am clearly alive and well!")
            .setAuthor({ name: 'ALPHA', iconURL: 'https://cdn.discordapp.com/avatars/797862942036721664/ffc64d41e14d5d913c8a543dc4024cef.webp', url: 'https://github.com/Blboun3/ALPHA-Admin' })
            .setThumbnail('https://img.icons8.com/neon/256/ok.png')
            .setTimestamp()
            .setFooter({text: 'ALPHA Admin bot by Blboun3#0084'})
            .addFields(
                { name: 'Software info', value: `Running on (OS): \`${info.os_type}\` version (kernel): \`${info.os_version}\`\nSystem uptime: \`${info.uptime}\``, inline: true},
                { name: 'Hardware info', value: `CPU Model: \`${info.cpu_model}\`\nCPU Architecture: \`${info.cpu_arch}\`\nLogical CPUs: \`${info.cpu_count}\`\nTotal system memory: \`${info.os_memory}\``, inline: true},
                { name: 'Bot info', value: `Version: \`${version}\`\nVersion name: \`${version_name}\`\nGithub: [https://github.com/Blboun3/ALPHA-Admin](https://github.com/Blboun3/ALPHA-Admin)`}
            )

        // Send embed as ephemeral
		await interaction.reply({embeds: [embed], ephemeral: true});
	},
};
