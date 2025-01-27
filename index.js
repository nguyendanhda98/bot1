require("dotenv").config();
require("module-alias/register");

const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");


const token = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Create a new DisTube
const ytDlpPlugin = new YtDlpPlugin();
const distube = new DisTube(client, {
  plugins: [ytDlpPlugin],
  savePreviousSongs: true,
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsClientPath = path.join(__dirname, "events", "client");
const eventClientFiles = fs
  .readdirSync(eventsClientPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventClientFiles) {
  const filePath = path.join(eventsClientPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(distube, ...args));
  }
}

// Xử lý lỗi toàn cục
process.on("uncaughtException", (error) => {
  // console.error("Uncaught Exception:", error);
  // Optionally, you can exit the process if needed
  // process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  // console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally, you can exit the process if needed
  // process.exit(1);
});

const eventsDistubePath = path.join(__dirname, "events", "distube");
const eventDistubeFiles = fs
  .readdirSync(eventsDistubePath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventDistubeFiles) {
  const filePath = path.join(eventsDistubePath, file);
  const event = require(filePath);

  distube.on(event.name, (...args) => event.execute(...args));
}

client.login(token);
