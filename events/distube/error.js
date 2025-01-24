const { Events } = require("distube");

module.exports = {
  name: Events.ERROR,

  execute(client, error) {
    // thông báo cho người dùng lỗi
    client.channels.cache
      .get(client.config.logs.error)
      .send(`Đã xảy ra lỗi: \`${error}\``);
    console.error(error);
  },
};
