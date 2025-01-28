const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");
const { triggerPlaySongEvent } = require("@utils/events/playsong");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Xáo trộn danh sách phát."),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      const song = queue.songs[0];

      await queue.shuffle();
      await interaction.deleteReply();
      await interaction.channel.send("Đã xáo trộn danh sách phát.");
      triggerPlaySongEvent(distube, queue, song);
    } catch (error) {
      console.error("shuffle.js error: ", error);
      return await interaction.editReply({
        content: "An error occurred while shuffling the queue.",
        ephemeral: true,
      });
    }
  },
};
