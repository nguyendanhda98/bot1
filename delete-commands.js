require("dotenv").config();
const { REST, Routes } = require("discord.js");

const clientId = process.env.CLIENT_ID;
// const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("Started deleting application (/) commands.");

    // Fetch all guild commands
    const guildCommands = await rest.get(Routes.applicationCommands(clientId));

    // Delete all guild commands
    for (const command of guildCommands) {
      await rest.delete(
        Routes.applicationGuildCommand(clientId, guildId, command.id)
      );
    }

    console.log("Successfully deleted all application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
