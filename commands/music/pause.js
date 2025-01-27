const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");
const { interactionEmbed } = require("@utils/embedTemplate");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Tạm dừng phát nhạc."),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      await queue.pause();

      // Send an embed message
      const embed = interactionEmbed({
        authorName: interaction.user.globalName
          ? interaction.user.globalName
          : interaction.user.username,
        authoriconURL: interaction.user.displayAvatarURL(),
        color: "#FF0000",
        title: "⏸ Dừng phát nhạc.",
        description: "Dùng lệnh /resume để tiếp tục phát nhạc.",
      });

      await interaction.deleteReply();
      await interaction.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("pause.js error: ", error);
      return await interaction.editReply({
        content: "An error occurred while pausing the music.",
        ephemeral: true,
      });
    }
  },
};
