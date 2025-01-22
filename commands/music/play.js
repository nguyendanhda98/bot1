const { SlashCommandBuilder } = require("discord.js");
const ytsr = require("@distube/ytsr");
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
      const searchResult = await ytsr(query, { limit: 10 });
      const choices = searchResult.items
        .filter((item) => item.type === "video")
        .map((item) => ({
          name: `${item.name.substring(0, 89)} - ${item.duration}`.substring(
            0,
            100
          ),
          value: item.url,
        }));

      await interaction.respond(choices);
    } catch (error) {
      console.error(error);
      await interaction.respond([]);
    }
  },
  async execute(distube, interaction) {
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
      return interaction.reply(
        "Bạn cần cung cấp tên bài hát hoặc link youtube!"
      );

    try {
      await interaction.deferReply();
      //check if query is a link
      if (query.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)) {
        await distube.play(voiceChannelMember, query, {
          textChannel: interaction.channel,
          member,
        });
      }
      //search for the song
      else {
        const searchResult = await ytsr(query, { limit: 1 });
        if (searchResult.items.length === 0) {
          return interaction.channel.send("No results found!");
        }
        const song = searchResult.items[0];
        await distube.play(voiceChannelMember, song.url, {
          textChannel: interaction.channel,
          member,
        });
      }
      return interaction.editReply("Đã phát nhạc!");
    } catch (error) {
      console.error(error);
      return interaction.editReply("Đã xảy ra lỗi khi phát nhạc!");
    }
  },
};
