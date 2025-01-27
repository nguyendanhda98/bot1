const { Events } = require("distube");

module.exports = {
  name: Events.NO_RELATED,
  execute(queue) {
    if (queue && queue.textChannel) {
      queue.textChannel.send("NO_RELATED");
    } else {
      console.error("NO_RELATED error");
    }
  },
};
