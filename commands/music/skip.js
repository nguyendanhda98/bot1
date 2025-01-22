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
    if (!validateVoiceChannelRequirements(interaction)) {
      return;
    }

    const queue = distube.getQueue(interaction);
    if (!(await isQueueExists(queue, interaction))) return;

    if (queue.songs.length === 1) {
      queue.stop();
      return await interaction.reply(
        "Và đó là bài hát cuối cùng trong danh sách phát!"
      );
    } else {
      queue.skip();
      return await interaction.reply("Đã bỏ qua bài hát.");
    }
  },
};
