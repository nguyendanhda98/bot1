const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Chuyển đến bài hát trước đó."),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      await queue.previous();
    } catch (error) {
      console.error("previous.js error: ", error);
      return await interaction.editReply({
        content: "Không có bài hát trước đó!",
        ephemeral: true,
      });
    }
  },
};
