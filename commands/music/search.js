const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ytsr = require("@distube/ytsr");

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
    ),
  async execute(interaction) {
    const query = interaction.options.getString("song");
    if (!query) {
      return await interaction.reply("Vui lòng nhập tên bài hát.");
    }

    const searchResult = await ytsr(query, { limit: 10 });
    if (!searchResult) {
      return await interaction.reply("Không tìm thấy kết quả.");
    }

    const choices = searchResult.items
      .filter((item) => item.type === "video")
      .map((item) => ({
        name: `${item.name.substring(0, 89)} - ${item.duration}`.substring(
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
            (choice, index) => `${index + 1}. [${choice.name}](${choice.value})`
          )
          .join("\n")
      )
      .setColor("#FF0000");

    await interaction.reply({ embeds: [embed] });
  },
};
