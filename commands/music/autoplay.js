const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Bật/tắt tự động phát nhạc."),
  async execute(distube, interaction) {
    if (!(await validateVoiceChannelRequirements(interaction))) return;

    const queue = distube.getQueue(interaction);
    if (!isQueueExists(queue, interaction)) return;

    queue.autoplay = !queue.autoplay;
    await interaction.reply(`Autoplay is now ${queue.autoplay ? "on" : "off"}`);
  },
};
