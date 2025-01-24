async function isMemberInVoiceChannel(interaction) {
  const userVoiceChannelId = interaction.member.voice.channelId;

  if (!userVoiceChannelId) {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("Bạn cần vào voice channel trước!");
    } else {
      await interaction.deferReply();
      await interaction.editReply("Bạn cần vào voice channel trước!");
    }
    return false;
  }

  return true;
}

async function isBotInVoiceChannel(interaction) {
  const botVoiceChannelId = interaction.guild.members.me.voice.channelId;

  if (!botVoiceChannelId) {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("Bot cần vào voice channel trước!");
    } else {
      await interaction.deferReply();
      await interaction.editReply("Bot cần vào voice channel trước!");
    }
    return false;
  }

  return true;
}

async function isMemberInSameVoiceChannel(interaction) {
  const userVoiceChannelId = interaction.member.voice.channelId;
  const botVoiceChannelId = interaction.guild.members.me.voice.channelId;

  if (userVoiceChannelId !== botVoiceChannelId) {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply("Bạn cần vào cùng voice channel với bot!");
    } else {
      await interaction.deferReply();
      await interaction.editReply("Bạn cần vào cùng voice channel với bot!");
    }

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
