const { Events } = require("distube");

module.exports = {
  name: Events.DELETE_QUEUE,
  execute(queue) {
    if (queue && queue.textChannel) {
      queue.textChannel.send("The queue has been deleted.");
    } else {
      console.error("Queue or textChannel is undefined");
    }
  },
};
