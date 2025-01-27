const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const {
  validateVoiceChannelRequirements,
} = require("@utils/voiceChannelUtils");
const { interactionEmbed } = require("@utils/embedTemplate");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave the voice channel"),
  async execute(distube, interaction) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      if (!(await validateVoiceChannelRequirements(interaction))) return;

      await distube.voices.leave(interaction.guild.id);

      // Send an embed message
      const embed = interactionEmbed({
        authorName: interaction.user.globalName ? interaction.user.globalName : interaction.user.username,
        authoriconURL: interaction.user.displayAvatarURL(),
        color: "#FF0000",
        title: "👋 Bot rời khỏi phòng",
        description: "Bot đã rời khỏi phòng.",
      });

      await interaction.deleteReply();
      await interaction.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("leave.js error: ", error);
      return await interaction.editReply({
        content: "An error occurred while leaving the voice channel.",
        ephemeral: true,
      });
    }
  },
};
