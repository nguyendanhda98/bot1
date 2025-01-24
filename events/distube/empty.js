const { Events } = require("distube");

module.exports = {
  name: Events.EMPTY,
  execute(queue) {
    if (queue && queue.textChannel) {
      queue.textChannel.send("The queue is empty.");
    } else {
      console.error("Queue or textChannel is undefined");
    }
  },
};
