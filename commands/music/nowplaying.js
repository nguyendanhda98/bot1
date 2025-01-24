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
    await interaction.deferReply();
    if (!(await validateVoiceChannelRequirements(interaction))) return;

    const queue = distube.getQueue(interaction);
    if (!(await isQueueExists(queue, interaction))) return;

    try {
      const song = queue.songs[0];
      await interaction.editReply(
        `Đang phát: ${song.name} - \`${song.formattedDuration}\``
      );
    } catch (error) {
      console.error(error);
      return await interaction.editReply({
        content: "An error occurred while getting the current song.",
        ephemeral: true,
      });
    }
  },
};
