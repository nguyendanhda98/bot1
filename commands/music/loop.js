const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");
const { interactionEmbed } = require("@utils/embedTemplate");
const { triggerPlaySongEvent } = require("@utils/events/playsong");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Lặp lại danh sách phát."),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      const song = queue.songs[0];
      const loop = queue.setRepeatMode();

      const embed = interactionEmbed({
        title: "Lặp lại danh sách phát.",
        description: `Đã ${
          loop === 0
            ? "tắt"
            : loop === 1
            ? "bật"
            : loop === 2
            ? "lặp lại bài hát hiện tại"
            : "lặp lại danh sách phát"
        } lặp lại danh sách phát.`,
        authorName: user.globalName,
        authoriconURL: user.displayAvatarURL(),
      });

      await interaction.deleteReply();
      await interaction.channel.send({ embeds: [embed] });
      triggerPlaySongEvent(distube, queue, song);
    } catch (error) {
      console.error("loop.js error: ", error);
      return await interaction.editReply({
        content: "An error occurred while looping the queue.",
        ephemeral: true,
      });
    }
  },
};
