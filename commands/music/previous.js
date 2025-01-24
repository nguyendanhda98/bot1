const { SlashCommandBuilder } = require("discord.js");
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
    await interaction.deferReply();
    if (!(await validateVoiceChannelRequirements(interaction))) return;

    const queue = distube.getQueue(interaction);
    if (!(await isQueueExists(queue, interaction))) return;

    try {
      await queue.previous();
    } catch (error) {
      console.error(error);
      return await interaction.editReply({
        content: "Không có bài hát trước đó!",
        ephemeral: true,
      });
    }
  },
};
