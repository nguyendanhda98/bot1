const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  category: "test",
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command"),
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  },
};
