const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Bật/tắt tự động phát nhạc."),
  async execute(distube, interaction) {
    await interaction.deferReply();
    if (!(await validateVoiceChannelRequirements(interaction))) return;

    const queue = distube.getQueue(interaction);
    if (!(await isQueueExists(queue, interaction))) return;

    const autoplay = queue.toggleAutoplay();

    await interaction.editReply(
      `Tự động phát nhạc đã được ${autoplay ? "bật" : "tắt"}.`
    );
  },
};
