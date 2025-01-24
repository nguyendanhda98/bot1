const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear the queue."),
  async execute(distube, interaction) {
    await interaction.deferReply();
    if (!(await validateVoiceChannelRequirements(interaction))) return;

    const queue = distube.getQueue(interaction);
    if (!queue) {
      await interaction.editReply("There is no queue.");
    } else {
      try {
        await queue.remove();
      } catch (error) {
        console.error(error);
        return await interaction.editReply({
          content: "An error occurred while clearing the queue.",
          ephemeral: true,
        });
      }
    }
  },
};
