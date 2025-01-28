const { Events } = require("distube");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { statusEmbed } = require("@utils/embedTemplate");

module.exports = {
  name: Events.PLAY_SONG,
  execute(queue, song) {
    const user = queue.distube.client.user;

    if (queue && queue.textChannel) {
      const pause = new ButtonBuilder()
        .setCustomId("pause")
        .setLabel("Pause")
        .setStyle(ButtonStyle.Secondary);

      const play = new ButtonBuilder()
        .setCustomId("resume")
        .setLabel("Resume")
        .setStyle(ButtonStyle.Secondary);

      const skip = new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("Skip")
        .setStyle(ButtonStyle.Primary);

      const stop = new ButtonBuilder()
        .setCustomId("leave")
        .setLabel("Leave")
        .setStyle(ButtonStyle.Danger);

      const nowplaying = new ButtonBuilder()
        .setCustomId("nowplaying")
        .setLabel("Now Playing")
        .setStyle(ButtonStyle.Success);

      const autoplay = new ButtonBuilder()
        .setCustomId("autoplay")
        .setLabel("Auto play")
        .setStyle(ButtonStyle.Secondary);

      const row1 = new ActionRowBuilder().addComponents(
        skip,
        nowplaying,
        pause,
        play,
        stop
      );
      const row2 = new ActionRowBuilder().addComponents(autoplay);

      const embed = statusEmbed({
        queue,
        authorName: user.globalName ? user.globalName : user.username,
        authoriconURL: user.displayAvatarURL(),
        song,
      });

      queue.textChannel.send({ embeds: [embed], components: [row1, row2] });
    } else {
      console.error(" PLAY_SONG error");
    }
  },
};
