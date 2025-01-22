const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(distube, interaction) {
    console.log("🚀 ~ execute ~ interaction:", distube);
    await interaction.reply("Pong!");
  },
};
