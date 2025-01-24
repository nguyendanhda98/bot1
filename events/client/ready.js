const { Events, REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const commands = [];
    const commandsPath = path.join(__dirname, "../../commands");

    if (!fs.existsSync(commandsPath)) {
      console.error(`The commands directory does not exist: ${commandsPath}`);
      return;
    }

    // Function to recursively get all .js files in a directory
    function getAllFiles(dirPath, arrayOfFiles) {
      const files = fs.readdirSync(dirPath);

      arrayOfFiles = arrayOfFiles || [];

      files.forEach((file) => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
          arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
        } else if (file.endsWith(".js")) {
          arrayOfFiles.push(path.join(dirPath, file));
        }
      });

      return arrayOfFiles;
    }

    const commandFiles = getAllFiles(commandsPath);

    for (const file of commandFiles) {
      const command = require(file);
      if ("data" in command && "toJSON" in command.data) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${file} is missing a required "data" or "toJSON" property.`
        );
      }
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
      console.log("Started deploying application (/) commands.");

      const guilds = client.guilds.cache.map((guild) => guild.id);

      for (const guildId of guilds) {
        const data = await rest.put(
          Routes.applicationGuildCommands(client.user.id, guildId),
          { body: commands }
        );
        console.log(
          `Successfully deployed ${data.length} commands for guild ${guildId}.`
        );
      }
    } catch (error) {
      console.error(error);
    }
  },
};
