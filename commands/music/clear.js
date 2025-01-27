const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");
const { interactionEmbed } = require("@utils/embedTemplate");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear the queue."),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      await queue.remove();

      const user = interaction.user;
      const embed = interactionEmbed({
        title: "Xoá danh sách phát.",
        description: "Đã xoá danh sách phát.",
        authorName: user.globalName,
        authoriconURL: user.displayAvatarURL(),
      });

      const textChannel = interaction.channel;
      if (textChannel) {
        await textChannel.send({ embeds: [embed] });
      } else {
        console.error("Text channel does not exist.");
      }
      await interaction.deleteReply();
    } catch (error) {
      console.error("clear.js error: ", error);
      return await interaction.editReply({
        content: "An error occurred while clearing the queue.",
        ephemeral: true,
      });
    }
  },
};
