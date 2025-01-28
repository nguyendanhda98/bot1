const { EmbedBuilder } = require("discord.js");
const { formatNumber } = require("@utils/number/formatNumber");

function interactionEmbed({
  authorName,
  authoriconURL,
  title,
  description,
  color = "#FF0000",
}) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setAuthor({
      name: authorName,
      iconURL: authoriconURL,
    })
    .setTimestamp();
}

function songEmbed({ authorName, authoriconURL, song }) {
  return new EmbedBuilder()
    .setTitle("🎵 Bài hát đang phát")
    .setDescription(`[${song.name}](${song.url})`)
    .setColor("#FF0000")
    .setTimestamp()
    .setAuthor({
      name: authorName,
      iconURL: authoriconURL,
    })
    .setThumbnail(song.thumbnail)
    .addFields(
      { name: "Duration", value: `${song.formattedDuration} ⏱️`, inline: true },
      {
        name: "Views",
        value: `${formatNumber(song.views)} 👁️`,
        inline: true,
      },
      { name: "Likes", value: `${formatNumber(song.likes)} 👍`, inline: true }
    );
}

function statusEmbed({
  queue,
  authorName,
  authoriconURL,
  song,
  color = "#FF0000",
}) {
  const nextSong = queue.songs[1] ? queue.songs[1].name : "None";
  const autoplayStatus = queue.autoplay ? "On" : "Off";
  const loopStatus = queue.loop ? "On" : "Off";
  return new EmbedBuilder()
    .setTitle("🎵 Bài hát đang phát")
    .setDescription(`[${song.name}](${song.url})`)
    .setColor(color)
    .setTimestamp()
    .setAuthor({
      name: authorName,
      iconURL: authoriconURL,
    })
    .setThumbnail(song.thumbnail)
    .addFields(
      { name: "Duration", value: `${song.formattedDuration} ⏱️`, inline: true },
      {
        name: "Views",
        value: `${formatNumber(song.views)} 👁️`,
        inline: true,
      },
      { name: "Likes", value: `${formatNumber(song.likes)} 👍`, inline: true }
    )
    .addFields(
      { name: "Autoplay", value: autoplayStatus, inline: true },
      { name: "Loop", value: loopStatus, inline: true },
      { name: "Next Song", value: nextSong, inline: true }
    );
}

module.exports = {
  interactionEmbed,
  songEmbed,
  statusEmbed,
};
