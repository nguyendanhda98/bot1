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

      const leave = new ButtonBuilder()
        .setCustomId("leave")
        .setLabel("Leave")
        .setStyle(ButtonStyle.Danger);

      const nowplaying = new ButtonBuilder()
        .setCustomId("nowplaying")
        .setLabel("Now Playing")
        .setStyle(ButtonStyle.Secondary);

      const row1 = new ActionRowBuilder().addComponents(
        skip,
        nowplaying,
        pause,
        play,
        leave
      );

      const autoplay = new ButtonBuilder()
        .setCustomId("autoplay")
        .setLabel("Auto play")
        .setStyle(ButtonStyle.Secondary);

      const loop = new ButtonBuilder()
        .setCustomId("loop")
        .setLabel("Loop")
        .setStyle(ButtonStyle.Secondary);

      const previous = new ButtonBuilder()
        .setCustomId("previous")
        .setLabel("Previous")
        .setStyle(ButtonStyle.Secondary);

      const queueBt = new ButtonBuilder()
        .setCustomId("queue")
        .setLabel("Queue")
        .setStyle(ButtonStyle.Secondary);

      const shuffle = new ButtonBuilder()
        .setCustomId("shuffle")
        .setLabel("Shuffle")
        .setStyle(ButtonStyle.Secondary);

      const row2 = new ActionRowBuilder().addComponents(
        autoplay,
        loop,
        previous,
        queueBt,
        shuffle
      );

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
