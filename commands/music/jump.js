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
    .setName("jump")
    .setDescription("Jump to a song in the queue")
    .addIntegerOption((option) =>
      option
        .setName("index")
        .setDescription("The index of the song in the queue")
        .setRequired(true)
    ),
  async execute(distube, interaction) {
    try {
      const user = interaction.user;
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      const queue = distube.getQueue(interaction);
      if (!(await isQueueExists(queue, interaction))) return;

      const song = queue.songs[0];
      const index = interaction.options.getInteger("index");
      const queueLength = queue.songs.length;

      if (index === 0 || index > queueLength || index < -queueLength) {
        await interaction.editReply("Invalid song index.");
        return;
      }

      const embed = interactionEmbed({
        title: "Jump to a song.",
        description: `Jumped to song at index ${index}`,
        authorName: user.globalName,
        authoriconURL: user.displayAvatarURL(),
      });

      await queue.jump(index);

      await interaction.deleteReply();
      await interaction.channel.send({ embeds: [embed] });
      triggerPlaySongEvent(distube, queue, song);
    } catch (error) {
      console.error("jump.js error: ", error);
      await interaction.editReply(
        "An error occurred while jumping to the song."
      );
    }
  },
};
