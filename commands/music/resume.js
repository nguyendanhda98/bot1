const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Tiếp tục phát nhạc."),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply();
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      queue.resume();
      await interaction.editReply("Đã tiếp tục phát nhạc.");
    } catch (error) {
      console.error(error);
      return await interaction.editReply({
        content: "An error occurred while resuming the music.",
        ephemeral: true,
      });
    }
  },
};
