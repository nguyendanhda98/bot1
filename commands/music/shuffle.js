const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Xáo trộn danh sách phát."),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply();
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      queue.shuffle();
      await interaction.editReply("Đã xáo trộn danh sách phát.");
    } catch (error) {
      console.error(error);
      return await interaction.editReply({
        content: "An error occurred while shuffling the queue.",
        ephemeral: true,
      });
    }
  },
};
