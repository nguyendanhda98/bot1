const { Events } = require("distube");

module.exports = {
  name: Events.FINISH,
  execute(queue) {
    if (queue && queue.textChannel) {
      queue.textChannel.send("Đã phát hết danh sách bài hát.");
    } else {
      console.error("FINISH error");
    }
  },
};
