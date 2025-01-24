const { SlashCommandBuilder } = require("discord.js");
const YouTube = require("youtube-sr").default;

const {
  isMemberInSameVoiceChannel,
  isMemberInVoiceChannel,
} = require("@utils/voiceChannelUtils");

let lastQueryTime = 0;
const DEBOUNCE_TIME = 500; // 500ms

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
      console.error(error);
      await interaction.respond([]);
    }
  },
  async execute(distube, interaction) {
    await interaction.deferReply();
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

    try {
      //check if query is a link
      if (query.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)) {
        await distube.play(voiceChannelMember, query, {
          textChannel: interaction.channel,
          member,
        });
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
      }
      return interaction.editReply("Đã thêm bài hát vào hàng chờ!");
    } catch (error) {
      console.error(error);
      return interaction.editReply("Đã xảy ra lỗi khi phát nhạc!");
    }
  },
};
