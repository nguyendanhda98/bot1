async function isMemberInVoiceChannel(interaction) {
  const userVoiceChannelId = interaction.member.voice.channelId;

  if (!userVoiceChannelId) {
    await interaction.reply("Bạn cần vào voice channel trước!");
    return false;
  }

  return true;
}

async function isBotInVoiceChannel(interaction) {
  const botVoiceChannelId = interaction.guild.me.voice.channelId;

  if (!botVoiceChannelId) {
    await interaction.reply("Bot cần vào voice channel trước!");
    return false;
  }

  return true;
}

async function isMemberInSameVoiceChannel(interaction) {
  const userVoiceChannelId = interaction.member.voice.channelId;
  const botVoiceChannelId = interaction.guild.me.voice.channelId;

  if (userVoiceChannelId !== botVoiceChannelId) {
    await interaction.reply("Bạn cần vào cùng voice channel với bot!");
    return false;
  }

  return true;
}

async function validateVoiceChannelRequirements(interaction) {
  if (!(await isMemberInVoiceChannel(interaction))) {
    return false;
  }

  if (!(await isBotInVoiceChannel(interaction))) {
    return false;
  }

  if (!(await isMemberInSameVoiceChannel(interaction))) {
    return false;
  }

  return true;
}

module.exports = {
  isMemberInSameVoiceChannel,
  isMemberInVoiceChannel,
  isBotInVoiceChannel,
  validateVoiceChannelRequirements,
};
