const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Lặp lại danh sách phát."),
  async execute(distube, interaction) {
    if (!validateVoiceChannelRequirements(interaction)) {
      return;
    }

    const queue = distube.getQueue(interaction);
    if (!(await isQueueExists(queue, interaction))) return;

    const loop = queue.setRepeatMode();
    await interaction.reply(
      `Đã ${
        loop === 0
          ? "tắt"
          : loop === 1
          ? "bật"
          : loop === 2
          ? "lặp lại bài hát hiện tại"
          : "lặp lại danh sách phát"
      } lặp lại danh sách phát.`
    );
  },
};
