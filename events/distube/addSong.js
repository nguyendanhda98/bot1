const { Events } = require("distube");

module.exports = {
  name: Events.ADD_SONG,
  execute(queue, song) {
    if (queue && queue.textChannel) {
      queue.textChannel.send(`Đã thêm vào danh sách phát: ${song.name}`);
    } else {
      console.error("Queue or textChannel is undefined");
    }
  },
};
