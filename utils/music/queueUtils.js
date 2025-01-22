async function isQueueExists(queue, interaction) {
  if (!queue) {
    await interaction.reply("There is no queue.");
    return false;
  }

  return true;
}

module.exports = {
  isQueueExists,
};
