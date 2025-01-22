const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("Jump to a song in the queue")
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("The index of the song in the queue")
        .setRequired(true)
    ),
  async execute(distube, interaction) {
    if (!(await validateVoiceChannelRequirements(interaction))) return;

    const queue = distube.getQueue(interaction);
    if (!(await isQueueExists(queue, interaction))) return;

    const index = interaction.options.getInteger("index");
    const queueLength = queue.songs.length;

    if (index === 0 || index > queueLength || index < -queueLength) {
      await interaction.reply("Invalid song index.");
      return;
    }

    queue.jump(index);
    await interaction.reply(`Jumped to song at index ${index}`);
  },
};
