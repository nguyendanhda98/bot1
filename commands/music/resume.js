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
    .setName("resume")
    .setDescription("Tiếp tục phát nhạc."),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      const song = queue.songs[0];
      await queue.resume();

      // Send an embed message
      const embed = interactionEmbed({
        authorName: interaction.user.globalName
          ? interaction.user.globalName
          : interaction.user.username,
        authoriconURL: interaction.user.displayAvatarURL(),
        color: "#FF0000",
        title: "▶️ Tiếp tục phát nhạc.",
        description: "Dùng lệnh /pause để tạm dừng phát nhạc.",
      });

      await interaction.deleteReply();
      await interaction.channel.send({ embeds: [embed] });
      triggerPlaySongEvent(distube, queue, song);
    } catch (error) {
      console.error("resume.js error: ", error);
      return await interaction.editReply({
        content: "An error occurred while resuming the music.",
        ephemeral: true,
      });
    }
  },
};
