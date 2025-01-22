const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Hiển thị bài hát đang phát."),
  async execute(distube, interaction) {
    if (!validateVoiceChannelRequirements(interaction)) {
      return;
    }

    const queue = distube.getQueue(interaction);
    if (!(await isQueueExists(queue, interaction))) return;

    const song = queue.songs[0];
    await interaction.reply(
      `Đang phát: ${song.name} - \`${song.formattedDuration}\``
    );
  },
};
