const { Events } = require("distube");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: Events.PLAY_SONG,
  execute(queue, song) {
    if (queue && queue.textChannel) {
      const pause = new ButtonBuilder()
        .setCustomId("pause")
        .setLabel("Pause")
        .setStyle(ButtonStyle.Secondary);

      const play = new ButtonBuilder()
        .setCustomId("play")
        .setLabel("Play")
        .setStyle(ButtonStyle.Success);

      const skip = new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("Skip")
        .setStyle(ButtonStyle.Primary);

      const stop = new ButtonBuilder()
        .setCustomId("stop")
        .setLabel("Stop")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(pause, play, skip, stop);

      queue.textChannel.send({
        content: `Now playing: ${song.name}`,
        components: [row],
      });
    } else {
      console.error("Queue or textChannel is undefined");
    }
  },
};
