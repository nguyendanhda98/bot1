const { Events } = require("distube");
const { interactionEmbed } = require("@utils/embedTemplate");

module.exports = {
  name: Events.DELETE_QUEUE,
  execute(queue) {
    if (queue && queue.textChannel) {
      const user = queue.distube.client.user;
      if (user.bot) return;
      const embed = interactionEmbed({
        title: "Xoá danh sách phát.",
        description: "Đã xoá danh sách phát.",
        authorName: user.globalName ? user.globalName : user.username,
        authoriconURL: user.displayAvatarURL(),
      });
      queue.textChannel.send({ embeds: [embed] });
    } else {
      console.error("DELETE_QUEUE error");
    }
  },
};
