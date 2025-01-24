const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Bỏ qua bài hát đang phát."),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply();
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      if (queue.songs.length === 1) {
        await distube.voices.leave(interaction.guild.id);
        return await interaction.editReply(
          "Và đó là bài hát cuối cùng trong danh sách phát!"
        );
      } else {
        await queue.skip();
        return await interaction.editReply("Đã bỏ qua bài hát.");
      }
    } catch (error) {
      console.error(error);
      return await interaction.editReply({
        content: "An error occurred while skipping the song.",
        ephemeral: true,
      });
    }
  },
};
