const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Hiển thị danh sách lệnh."),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Commands")
      .setDescription(
        `**/autoplay** - Bật/tắt tự động phát nhạc.\n
        **/clear** - Xóa danh sách phát.\n
        **/help** - Hiển thị danh sách lệnh.\n
        **/jump <index>** - Nhảy đến bài hát trong danh sách phát.\n
        **/leave** - Bot sẽ rời khỏi voice channel.
        **/loop** - Lặp lại danh sách phát.\n
        **/nowplaying** - Hiển thị bài hát đang phát.\n
        **/pause** - Tạm dừng phát nhạc.\n
        **/play <query>** - Phát nhạc từ tên bài hát hoặc link youtube.\n
        **/previous** - Phát bài hát trước đó.\n
        **/queue** - Hiển thị danh sách phát.\n
        **/resume** - Tiếp tục phát nhạc.\n
        **/search <query>** - Tìm kiếm bài hát trên youtube.\n
        **/shuffle** - Xáo trộn danh sách phát.\n
        **/skip** - Bỏ qua file âm thanh đang phát.\n`
      )
      .setColor("#FF0000"); // You can set any color you like

    await interaction.reply({ embeds: [embed] });
  },
};
