async function isQueueExists(queue, interaction) {
  if (!queue) {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("There is no queue.");
    } else {
      await interaction.deferReply();
      await interaction.editReply("There is no queue.");
    }
    return false;
  }
  return true;
}

module.exports = {
  isQueueExists,
};
