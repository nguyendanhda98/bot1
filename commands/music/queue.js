const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { isQueueExists } = require("@utils/music/queueUtils");
const { interactionEmbed } = require("@utils/embedTemplate");
const { triggerPlaySongEvent } = require("@utils/events/playsong");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Hiển thị danh sách phát."),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      const song = queue.songs[0];
      const queueSongs = queue.songs.map((song, index) => {
        return `${index}. ${song.name} - \`${song.formattedDuration}\``;
      });

      const embed = interactionEmbed({
        authorName: interaction.user.globalName
          ? interaction.user.globalName
          : interaction.user.username,
        authoriconURL: interaction.user.displayAvatarURL(),
        title: "Danh sách phát",
        description: queueSongs.join("\n"),
      });

      await interaction.deleteReply();
      await interaction.channel.send({ embeds: [embed] });
      triggerPlaySongEvent(distube, queue, song);
    } catch (error) {
      console.error("queue.js error: ", error);
      return await interaction.editReply({
        content: "An error occurred while getting the queue.",
        ephemeral: true,
      });
    }
  },
};
