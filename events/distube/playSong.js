const { Events } = require("distube");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { songEmbed } = require("@utils/embedTemplate");

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

      const nowPlaying = new ButtonBuilder()
        .setCustomId("nowplaying")
        .setLabel("Now Playing")
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(
        skip,
        nowPlaying,
        pause,
        play,
        stop
      );

      const embed = songEmbed({
        authorName: user.globalName ? user.globalName : user.username,
        authoriconURL: user.displayAvatarURL(),
        song,
      });

      queue.textChannel.send({ embeds: [embed], components: [row] });
    } else {
      console.error(" PLAY_SONG error");
    }
  },
};
