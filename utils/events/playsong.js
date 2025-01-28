const { Events } = require("distube");

module.exports = {
  triggerPlaySongEvent(distube, queue, song) {
    distube.emit(Events.PLAY_SONG, queue, song);
  },
};
