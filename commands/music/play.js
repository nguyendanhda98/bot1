const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const YouTube = require("youtube-sr").default;
const { interactionEmbed } = require("@utils/embedTemplate");

const {
  isMemberInSameVoiceChannel,
  isMemberInVoiceChannel,
} = require("@utils/voiceChannelUtils");

// let lastQueryTime = 0;
// const DEBOUNCE_TIME = 500; // 500ms

module.exports = {
  category: "music",
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("The name or link of the song to play")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  // search for the song
  async autocomplete(interaction) {
    try {
      // const currentTime = Date.now();
      // if (currentTime - lastQueryTime < DEBOUNCE_TIME) {
      //   return interaction.respond([]);
      // }
      // lastQueryTime = currentTime;

      const query = interaction.options.getFocused();
      if (!query) {
        return interaction.respond([]);
      }
      const songs = await YouTube.search(query, { limit: 10 });
      const choices = songs.map((item) => ({
        name: `${item.title.substring(0, 89)} - ${
          item.durationFormatted
        }`.substring(0, 100),
        value: item.url,
      }));

      await interaction.respond(choices);
    } catch (error) {
      console.error("play.js error: ", error);
      await interaction.respond([]);
    }
  },
  async execute(distube, interaction) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      const member = interaction.member;
      const botMember = interaction.guild.members.me;
      const voiceChannelMember = member.voice.channel;

      // Nếu người dùng không ở voice channel
      if (!(await isMemberInVoiceChannel(interaction))) {
        return;
      }

      if (botMember.voice.channelId) {
        // Nếu người dùng không ở cùng voice channel với bot
        if (!(await isMemberInSameVoiceChannel(interaction))) {
          return;
        }
      }

      const query = interaction.options.getString("song");
      if (!query)
        return interaction.editReply(
          "Bạn cần cung cấp tên bài hát hoặc link youtube!"
        );

      //check if query is a link
      if (query.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)) {
        await distube.play(voiceChannelMember, query, {
          textChannel: interaction.channel,
          member,
        });
        const song = distube.getQueue(interaction).songs[0];

        const embed = interactionEmbed({
          title: "Thêm bài hát.",
          description: `Đã thêm bài hát **${song.name}** - \`${song.formattedDuration}\` vào danh sách phát.`,
          authorName: member.user.globalName
            ? member.user.globalName
            : member.user.username,
          authoriconURL: member.user.displayAvatarURL(),
        });

        await interaction.deleteReply();
        await interaction.channel.send({ embeds: [embed] });
      }
      // check if query is a playlist. Not supported yet
      else if (
        query.match(
          /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/playlist\?list=.+$/
        )
      ) {
        return interaction.editReply("Playlists are not supported yet!");
      }
      //search for the song
      else {
        const song = await YouTube.searchOne(query);
        if (!song) {
          return interaction.editReply("No results found!");
        }

        await distube.play(voiceChannelMember, song.url, {
          textChannel: interaction.channel,
          member,
        });

        const embed = interactionEmbed({
          title: "Thêm bài hát.",
          description: `Đã thêm bài hát **${song.title}** - \`${song.durationFormatted}\` vào danh sách phát.`,
          authorName: member.user.globalName
            ? member.user.globalName
            : member.user.username,
          authoriconURL: member.user.displayAvatarURL(),
        });

        await interaction.deleteReply();
        await interaction.channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error("play.js error: ", error);
      return interaction.editReply("Đã xảy ra lỗi khi phát nhạc!");
    }
  },
};
