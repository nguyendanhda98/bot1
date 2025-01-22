const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave the voice channel"),
  async execute(distube, interaction) {
    if (!validateVoiceChannelRequirements(interaction)) {
      return;
    }

    const queue = distube.getQueue(interaction);
    if (!(await isQueueExists(queue, interaction))) return;

    queue.stop();
    await interaction.reply("Đã rời khỏi voice channel.");
  },
};
