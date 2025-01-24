const { Events } = require("distube");

module.exports = {
  name: Events.FINISH,
  execute(queue) {
    if (queue && queue.textChannel) {
      queue.textChannel.send("No more song in queue");
    } else {
      console.error("Queue or textChannel is undefined");
    }
  },
};
