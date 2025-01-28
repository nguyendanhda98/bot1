const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");
const { interactionEmbed } = require("@utils/embedTemplate");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Bỏ qua bài hát đang phát."),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      if (queue.songs.length === 1 && !queue.autoplay) {
        // Send an embed message
        const embed = interactionEmbed({
          authorName: interaction.user.globalName
            ? interaction.user.globalName
            : interaction.user.username,
          authoriconURL: interaction.user.displayAvatarURL(),
          color: "#FF0000",
          title: "❌ Bỏ qua bài hát",
          description: "Không có bài hát nào trong danh sách chờ để bỏ qua.",
        });

        await interaction.deleteReply();
        return await interaction.channel.send({ embeds: [embed] });
      } else {
        await queue.skip();

        // Send an embed message
        const embed = interactionEmbed({
          authorName: interaction.user.globalName
            ? interaction.user.globalName
            : interaction.user.username,
          authoriconURL: interaction.user.displayAvatarURL(),
          color: "#FF0000",
          title: "⏭ Bỏ qua bài hát",
          description: "Bài hát đã được bỏ qua.",
        });

        await interaction.deleteReply();
        await interaction.channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error("skip.js error: ", error);
      return await interaction.editReply({
        content: "❌ Bỏ qua bài hát lỗi",
        ephemeral: true,
      });
    }
  },
};
