const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command"),
  async execute(distube, interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const results = await distube.plugins[0].searchSong("https://www.youtube.com/watch?v=r4TnL3KnJ_8", {
      type: "video",
      limit: 10,
    });
    // console.log(results);
    const relatedSong = await distube.plugins[0].getRelatedSongs(results);
    console.log(relatedSong);
  },
};
