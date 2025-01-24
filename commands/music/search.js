const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const YouTube = require("youtube-sr").default;

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Tìm kiếm bài hát trên youtube.")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Tên bài hát cần tìm kiếm.")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    try {
      const query = interaction.options.getFocused();
      if (!query) {
        return interaction.respond([]);
      }

      const searchResult = await YouTube.getSuggestions(query, { limit: 5 });
      const choices = searchResult.map((item) => ({
        name: item,
        value: item,
      }));

      await interaction.respond(choices);
    } catch (error) {
      console.error(error);
      await interaction.respond([]);
    }
  },
  async execute(distube, interaction) {
    try {
      await interaction.deferReply();
      const query = interaction.options.getString("song");
      if (!query) {
        return await interaction.editReply("Vui lòng nhập tên bài hát.");
      }

      const searchResult = await YouTube.search(query);
      if (!searchResult) {
        return await interaction.editReply("Không tìm thấy kết quả.");
      }

      const choices = searchResult.map((item) => ({
        name: `${item.title.substring(0, 89)} - ${item.duration}`.substring(
          0,
          100
        ),
        value: item.url,
      }));

      const embed = new EmbedBuilder()
        .setTitle("Search results")
        .setDescription(
          choices
            .map(
              (choice, index) =>
                `${index + 1}. [${choice.name}](${choice.value})`
            )
            .join("\n")
        )
        .setColor("#FF0000");

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return await interaction.editReply({
        content: "An error occurred while searching for the song.",
        ephemeral: true,
      });
    }
  },
};
