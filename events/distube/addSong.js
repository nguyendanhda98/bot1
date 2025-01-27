const { Events } = require("distube");
const { interactionEmbed } = require("@utils/embedTemplate");

module.exports = {
  name: Events.ADD_SONG,
  execute(queue, song) {
    if (queue && queue.textChannel) {
      const user = queue.distube.client.user;
      if (user.bot) return;
      const embed = interactionEmbed({
        title: "Thêm bài hát.",
        description: `Đã thêm bài hát **${song.name}** vào danh sách phát.`,
        authorName: user.globalName ? user.globalName : user.username,
        authoriconURL: user.displayAvatarURL(),
      });

      queue.textChannel.send({ embeds: [embed] });
    } else {
      console.error("ADD_SONG error");
    }
  },
};
