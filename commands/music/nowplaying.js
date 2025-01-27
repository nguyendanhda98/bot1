const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");
const { songEmbed } = require("@utils/embedTemplate");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Hiển thị bài hát đang phát."),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      const song = queue.songs[0];

      // Send an embed message
      const embed = songEmbed({
        authorName: interaction.user.globalName
          ? interaction.user.globalName
          : interaction.user.username,
        authoriconURL: interaction.user.displayAvatarURL(),
        song,
      });

      await interaction.deleteReply();
      await interaction.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("nowplaying.js error: ", error);
      return await interaction.editReply({
        content: "An error occurred while getting the current song.",
        ephemeral: true,
      });
    }
  },
};
