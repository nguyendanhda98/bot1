const { Events } = require("distube");

module.exports = {
  name: Events.EMPTY,
  execute(queue) {
    if (queue && queue.textChannel) {
      queue.textChannel.send("Danh sách bài hát trống.");
    } else {
      console.error("EMPTY error");
    }
  },
};
