const { Events } = require("distube");

module.exports = {
  name: Events.ERROR,
  execute(channel, error) {
    // if (error.errorCode === "NO_UP_NEXT") {
    //   channel.send("There is no song up next!");
    // } else {
    //   console.error(error);
    //   channel.send(`An error occurred: ${error.message}`);
    // }
  },
};
