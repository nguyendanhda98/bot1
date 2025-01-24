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
    try {
      await interaction.deferReply();
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      const queueSongs = queue.songs.map((song, index) => {
        return `${index}. ${song.name} - \`${song.formattedDuration}\``;
      });

      await interaction.editReply(`Danh sách phát:\n${queueSongs.join("\n")}`);
    } catch (error) {
      console.error(error);
      return await interaction.editReply({
        content: "An error occurred while getting the queue.",
        ephemeral: true,
      });
    }
  },
};
