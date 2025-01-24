const {
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  ActionRowBuilder, // Thêm dòng này
} = require("discord.js");

module.exports = {
  category: "test",
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command"),
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") ?? "No reason provided";

    const confirm = new ButtonBuilder()
      .setCustomId("confirm")
      .setLabel("Confirm Ban")
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(cancel, confirm);

    await interaction.reply({
      content: `Are you sure you want to ban ${target}? Reason: ${reason}`,
      components: [row],
    });
  },
};
