const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const lyricsFinder = require("lyrics-finder");
const _ = require("lodash");

module.exports = {
  name: "lyrics",
  description: "Hiển thị lời bài hát được tìm kiếm",
  usage: "[Song Name]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["ly"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    let SongTitle = args.join(" ");
    let SearchString = args.join(" ");
    if (!args[0] && !player) return client.sendTime(message.channel, "❌ | **Không có gì đang phát ngay bây giờ...**");
    if (!args[0]) SongTitle = player.queue.current.title;

    let lyrics = await lyricsFinder(SongTitle);
    if (!lyrics) return client.sendTime(message.channel, `**Không tìm thấy lời bài hát nào cho -** \`${SongTitle}\``);
    lyrics = lyrics.split("\n"); //spliting into lines
    let SplitedLyrics = _.chunk(lyrics, 40); //45 lines each page

    let Pages = SplitedLyrics.map((ly) => {
      let em = new MessageEmbed()
        .setAuthor(`Lời bài hát cho: ${SongTitle}`, client.config.IconURL)
        .setColor("RANDOM")
        .setDescription(ly.join("\n"));

      if (args.join(" ") !== SongTitle) em.setThumbnail(player.queue.current.displayThumbnail());

      return em;
    });

    if (!Pages.length || Pages.length === 1) return message.channel.send(Pages[0]);
    else return client.Pagination(message, Pages);
  },

  SlashCommand: {
    options: [
      {
        name: "song",
        value: "song",
        type: 3,
        description: "Nhập tên bài hát để tìm kiếm",
        required: false,
      },
    ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */

    run: async (client, interaction, args, { GuildDB }) => {
      let player = await client.Manager.get(interaction.guild_id);

      if (!interaction.data.options && !player) return client.sendTime(interaction, "❌ | **Không có gì đang phát ngay bây giờ...**");

      SongTitle = interaction.data.options ? interaction.data.options[0].value : player.queue.current.title;
      let lyrics = await lyricsFinder(SongTitle);
      console.log(lyrics.length === 0)
      if (lyrics.length === 0)
        return client.sendTime(interaction, `**Không tìm thấy lời bài hát nào cho -** \`${SongTitle}\``);
      lyrics = lyrics.split("\n"); //spliting into lines
      let SplitedLyrics = _.chunk(lyrics, 40); //45 lines each page

      let Pages = SplitedLyrics.map((ly) => {
        let em = new MessageEmbed()
          .setAuthor(`Lời bài hát cho: ${SongTitle}`, client.config.IconURL)
          .setColor("RANDOM")
          .setDescription(ly.join("\n"));

        if (SongTitle !== SongTitle) em.setThumbnail(player.queue.current.displayThumbnail());

        return em;
      });
      if (!Pages.length || Pages.length === 1)
        return interaction.send(Pages[0]);

    },
  }
};
