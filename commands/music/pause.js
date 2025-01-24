const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Tạm dừng phát nhạc."),
  async execute(distube, interaction) {
    await interaction.deferReply();
    if (!(await validateVoiceChannelRequirements(interaction))) return;

    const queue = distube.getQueue(interaction);
    if (!(await isQueueExists(queue, interaction))) return;

    try {
      queue.pause();
      await interaction.editReply("Đã tạm dừng phát nhạc.");
    } catch (error) {
      console.error(error);
      return await interaction.editReply({
        content: "An error occurred while pausing the music.",
        ephemeral: true,
      });
    }
  },
};
