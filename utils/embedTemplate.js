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
      { name: "Độ dài", value: `${song.formattedDuration} ⏱️`, inline: true },
      {
        name: "Views",
        value: `${formatNumber(song.views)} 👁️`,
        inline: true,
      },
      { name: "Likes", value: `${formatNumber(song.likes)} 👍`, inline: true }
    );
}

module.exports = {
  interactionEmbed,
  songEmbed,
};
