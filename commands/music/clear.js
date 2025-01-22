const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Bật/tắt tự động phát nhạc."),
  async execute(distube, interaction) {
    if (!(await validateVoiceChannelRequirements(interaction))) return;

    const queue = distube.getQueue(interaction);
    if (!queue) {
      await interaction.reply("There is no queue.");
    } else {
      queue.remove();
      await interaction.reply("Queue has been cleared.");
    }
  },
};
