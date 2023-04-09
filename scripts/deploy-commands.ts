import { REST, Routes } from "discord.js";
import { data as commands } from "../src/commands";
import config from "../src/utils/config";
// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(config.token);

// and deploy your commands!
async function deploy() {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    //console.log(commands)
    await rest.put(Routes.applicationCommands(config.clientId), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${commands.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
}
void deploy();
