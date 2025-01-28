const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");
const { triggerPlaySongEvent } = require("@utils/events/playsong");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Bật/tắt tự động phát nhạc."),
  async execute(distube, interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    if (!(await validateVoiceChannelRequirements(interaction))) return;

    const queue = distube.getQueue(interaction);
    const song = queue.songs[0];
    if (!(await isQueueExists(queue, interaction))) return;

    const autoplay = queue.toggleAutoplay();

    await interaction.deleteReply();
    await interaction.channel.send(
      `Tự động phát nhạc đã được ${autoplay ? "bật" : "tắt"}.`
    );
    triggerPlaySongEvent(distube, queue, song);
  },
};
