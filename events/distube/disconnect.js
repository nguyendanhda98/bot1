const { Events } = require("distube");

module.exports = {
  name: Events.DISCONNECT,
  execute(queue) {
    if (queue && queue.textChannel) {
      queue.textChannel.send("Disconnected!");
    } else {
      console.error("Queue or textChannel is undefined");
    }
  },
};
