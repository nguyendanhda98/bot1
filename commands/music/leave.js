const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave the voice channel"),
  async execute(distube, interaction) {
    await interaction.deferReply();
    if (!(await validateVoiceChannelRequirements(interaction))) return;

    try {
      await distube.voices.leave(interaction.guild.id);
    } catch (error) {
      console.error(error);
      return await interaction.editReply({
        content: "An error occurred while leaving the voice channel.",
        ephemeral: true,
      });
    }
  },
};
