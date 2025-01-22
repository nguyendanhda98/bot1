const { SlashCommandBuilder } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Hiển thị danh sách phát."),
  async execute(distube, interaction) {
    if (!validateVoiceChannelRequirements(interaction)) {
      return;
    }

    const queue = distube.getQueue(interaction);
    if (!(await isQueueExists(queue, interaction))) return;

    const queueSongs = queue.songs.map((song, index) => {
      return `${index + 1}. ${song.name} - \`${song.formattedDuration}\``;
    });

    await interaction.reply(`Danh sách phát:\n${queueSongs.join("\n")}`);
  },
};
