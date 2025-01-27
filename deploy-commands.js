require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const clientId = process.env.CLIENT_ID;
const token = process.env.TOKEN;

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("Started deploying application (/) commands.");

    const guilds = clientId.guilds.cache.map((guild) => guild.id);

    for (const guildId of guilds) {
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      console.log(
        `Successfully deployed ${data.length} commands for guild ${guildId}.`
      );
    }
  } catch (error) {
    console.error("deploy-commands.js error: ", error);
  }
})();
