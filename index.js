require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  EmbedBuilder,
  Events,
} = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const ytsr = require("@distube/ytsr");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const ytDlpPlugin = new YtDlpPlugin();

// Create a new DisTube
const distube = new DisTube(client, {
  plugins: [ytDlpPlugin],
  emitNewSongOnly: true,
  savePreviousSongs: true,
});

// Đăng ký lệnh với Discord
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Bắt đầu đăng ký lệnh slash toàn cục...");

    // await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: [
          {
            name: "help",
            description: "Hiển thị danh sách lệnh.",
          },
          {
            name: "leave",
            description: "Bot sẽ rời khỏi voice channel.",
          },
          {
            name: "play",
            description: "Phát nhạc từ tên bài hát hoặc link youtube.",
            options: [
              {
                name: "query",
                type: 3, // STRING
                description: "Tên bài hát hoặc link youtube.",
                required: true,
              },
            ],
          },
          {
            name: "skip",
            description: "Bỏ qua file âm thanh đang phát.",
          },
          {
            name: "queue",
            description: "Hiển thị danh sách phát.",
          },
          {
            name: "pause",
            description: "Tạm dừng phát nhạc.",
          },
          {
            name: "resume",
            description: "Tiếp tục phát nhạc.",
          },
          {
            name: "loop",
            description: "Lặp lại danh sách phát.",
          },
          {
            name: "shuffle",
            description: "Xáo trộn danh sách phát.",
          },
          {
            name: "clear",
            description: "Xóa danh sách phát.",
          },
          {
            name: "jump",
            description: "Nhảy đến bài hát trong danh sách phát.",
            options: [
              {
                name: "index",
                type: 4, // INTEGER
                description: "Vị trí bài hát cần nhảy đến.",
                required: true,
              },
            ],
          },
          {
            name: "autoplay",
            description: "Bật/tắt tự động phát nhạc.",
          },
          {
            name: "search",
            description: "Tìm kiếm bài hát trên youtube.",
            options: [
              {
                name: "query",
                type: 3, // STRING
                description: "Tên bài hát cần tìm.",
                required: true,
              },
            ],
          },
          {
            name: "nowplaying",
            description: "Hiển thị bài hát đang phát.",
          },
          {
            name: "previous",
            description: "Phát bài hát trước đó.",
          },
          {
            name: "seek",
            description: "Nhảy đến thời gian trong bài hát.",
            options: [
              {
                name: "second",
                type: 3, // STRING
                description: "Giây cần nhảy đến.",
                required: true,
              },
            ],
          },
        ],
      }
    );

    console.log("Lệnh đã đăng ký thành công trên toàn cầu!");
  } catch (error) {
    console.error("Có lỗi khi đăng ký lệnh slash:", error);
  }
})();

client.on("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
});
// client.on("debug", console.log)

client.on(Events.InteractionCreate, async (interaction) => {
  // If the interaction is not a command, return
  if (!interaction.isCommand()) return;

  if (interaction.isAutocomplete()) {
    return interaction.reply({
      content: "Autocomplete interactions are not supported!",
      ephemeral: true,
    });
  }

  const { commandName, options, member } = interaction;

  if (commandName === "help") {
    const embed = new EmbedBuilder()
      .setTitle("Commands")
      .setDescription(
        `**/play <query>** - Phát nhạc từ tên bài hát hoặc link youtube.\n
        **/search <query>** - Tìm kiếm bài hát trên youtube.\n
        **/skip** - Bỏ qua file âm thanh đang phát.\n
        **/queue** - Hiển thị danh sách phát.\n
        **/pause** - Tạm dừng phát nhạc.\n
        **/resume** - Tiếp tục phát nhạc.\n
        **/loop** - Lặp lại danh sách phát.\n
        **/shuffle** - Xáo trộn danh sách phát.\n
        **/clear** - Xóa danh sách phát.\n
        **/jump <index>** - Nhảy đến bài hát trong danh sách phát.\n
        **/autoplay** - Bật/tắt tự động phát nhạc.\n
        **/nowplaying** - Hiển thị bài hát đang phát.\n
        **/previous** - Phát bài hát trước đó.\n
        **/seek <second>** - Nhảy đến thời gian trong bài hát.\n
        **/leave** - Bot sẽ rời khỏi voice channel.`
      )
      .setColor("#FF0000"); // You can set any color you like

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === "search") {
    const query = options.getString("query");
    if (!query) {
      return interaction.reply("Bạn cần cung cấp tên bài hát cần tìm!");
    }
    const searchResult = await ytsr(query, { limit: 5 });
    if (searchResult.items.length === 0) {
      return interaction.reply("No results found!");
    }
    const songs = searchResult.items
      .map(
        (song, index) =>
          `${index + 1}. [${song.name}](${song.url}) - ${song.duration}`
      )
      .join("\n");

    // send embed with search results
    const embed = new EmbedBuilder()
      .setTitle("Search Results")
      .setDescription(songs)
      .setColor("#FF0000"); // You can set any color you like

    return interaction.reply({ embeds: [embed] });
  }

  // voice channel of bot
  const voiceChannel = interaction.guild.members.me?.voice?.channel;
  const voiceChannelMember = member.voice.channel;

  // check if user is in a voice channel
  if (!voiceChannelMember) {
    return interaction.reply("Bạn cần vào voice channel trước!");
  }

  if (commandName === "play") {
    const query = interaction.options.getString("query");
    if (!query)
      return interaction.reply(
        "Bạn cần cung cấp tên bài hát hoặc link youtube!"
      );

    // check if the user is in the same voice channel as the bot
    if (voiceChannel && voiceChannel.id !== voiceChannelMember.id) {
      return interaction.reply("Bạn cần vào cùng voice channel với bot!");
    }

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
  }

  // check if bot is in a voice channel
  if (!voiceChannel) {
    return interaction.reply("Bot không ở trong voice channel!");
  }

  // check if user in same voice channel as bot
  if (voiceChannelMember && voiceChannelMember.id !== voiceChannel.id) {
    return interaction.reply("Bạn cần vào cùng voice channel với bot!");
  }

  const queue = distube.getQueue(interaction);

  if (commandName === "loop") {
    const loop = queue.setRepeatMode();

    return interaction.reply(
      `Danh sách phát đã được lặp lại: ${
        loop === 0 ? "Tắt" : loop === 1 ? "Bài hát" : "Danh sách phát"
      }`
    );
  }

  if (commandName === "leave") {
    distube.voices.leave(interaction.guildId);
    return interaction.reply("Bot đã rời khỏi voice channel!");
  }

  // check if there is a queue
  if (!queue) {
    return interaction.reply("Không có bài hát nào trong danh sách phát!");
  }

  if (commandName === "skip") {
    if (queue.songs.length === 1) {
      queue.stop();
      return interaction.reply(
        "Và đó là bài hát cuối cùng trong danh sách phát!"
      );
    } else {
      queue.skip();
      return interaction.reply("Bài hát đã được bỏ qua!");
    }
  }

  if (commandName === "queue") {
    const songs = queue.songs.map(
      (song, index) => `${index + 1}. ${song.name}`
    );

    return interaction.reply(`Danh sách phát:\n${songs.join("\n")}`);
  }

  if (commandName === "pause") {
    queue.pause();
    return interaction.reply("Nhạc đã được tạm dừng!");
  }

  if (commandName === "resume") {
    queue.resume();
    return interaction.reply("Nhạc đã được tiếp tục!");
  }

  if (commandName === "shuffle") {
    queue.shuffle();
    return interaction.reply("Danh sách phát đã được xáo trộn!");
  }

  if (commandName === "clear") {
    queue.remove();

    return interaction.reply("Danh sách phát đã được xóa!");
  }

  if (commandName === "jump") {
    const index = options.getInteger("index");
    queue.jump(index);
    return interaction.reply(`Jumped to song at position ${index}`);
  }

  if (commandName === "autoplay") {
    const mode = distube.toggleAutoplay(interaction);
    return interaction.reply(`Autoplay mode is now ${mode ? "On" : "Off"}`);
  }

  if (commandName === "nowplaying") {
    if (!queue) {
      return interaction.reply("Không có bài hát nào đang phát!");
    }

    const song = queue.songs[0];
    return interaction.reply(
      `Đang phát: ${song.name} - \`${song.formattedDuration}\``
    );
  }

  if (commandName === "previous") {
    queue.previous();
    return interaction.reply("Đã phát bài hát trước đó!");
  }

  if (commandName === "seek") {
    const second = options.getInteger("second");
    queue.seek(second);
    return interaction.reply(`Đã nhảy đến ${second} giây trong bài hát!`);
  }
});

// Queue status template
const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filter: \`${
    queue.filters.join(", ") || "Off"
  }\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

// DisTube event listeners, more in the documentation page
distube
  .on("playSong", (queue, song) =>
    queue.textChannel?.send(
      `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
    )
  )
  .on("addSong", (queue, song) =>
    queue.textChannel?.send(
      `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on("addList", (queue, playlist) =>
    queue.textChannel?.send(
      `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue`
    )
  )
  .on("finish", (queue) => queue.textChannel?.send("Finish queue!"))
  .on("finishSong", (queue) => {
    queue.textChannel?.send("Finish song!");
  })
  .on("disconnect", (queue) => queue.textChannel?.send("Disconnected!"))
  .on("empty", (queue) =>
    queue.textChannel?.send(
      "The voice channel is empty! Leaving the voice channel..."
    )
  )
  // DisTubeOptions.searchSongs > 1
  .on("searchResult", (message, result) => {
    let i = 0;
    message.channel.send(
      `**Choose an option from below**\n${result
        .map(
          (song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
        )
        .join("\n")}\n*Enter anything else or wait 30 seconds to cancel*`
    );
  })
  .on("searchCancel", (message) => message.channel.send("Searching canceled"))
  .on("searchInvalidAnswer", (message) =>
    message.channel.send("Invalid number of result.")
  )
  .on("searchNoResult", (message) => message.channel.send("No result found!"))
  .on("searchDone", () => {})
  .on("error", (channel, error) => {
    console.error(`Có lỗi xảy ra: ${error}`);
    if (channel && channel.send) {
      const errorMessage = error.message
        ? error.message.slice(0, 2000)
        : "Unknown error";
      channel.send(`An error encountered: ${errorMessage}`);
    } else {
      console.error("Channel is not valid or does not have a send method.");
    }
  });

client.login(process.env.TOKEN);
