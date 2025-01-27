const { Events } = require("distube");

module.exports = {
  name: Events.INIT_QUEUE,
  execute(queue) {
    // if (queue && queue.textChannel) {
    //   queue.textChannel.send("Đang tìm bài hát...");
    // } else {
    //   console.error("INIT_QUEUE error");
    // }
  },
};
