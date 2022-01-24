const { MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");

module.exports = {
  name: "skipto",
  description: `Chuyển đến một bài hát trong hàng đợi`,
  usage: "<number>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["st"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    const player = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false,
    });

    if (!player) return client.sendTime(message.channel, "❌ | **Nothing is playing right now...**");
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Bạn phải ở trong một kênh thoại để sử dụng lệnh này!**");
    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **Bạn phải ở cùng kênh thoại với tôi để sử dụng lệnh này!**");

    try {
      if (!args[0]) return client.sendTime(message.channel, `**Cách sử dụng**: \`${GuildDB.prefix}skipto [number]\``);
      //if the wished track is bigger then the Queue Size
      if (Number(args[0]) > player.queue.size) return client.sendTime(message.channel, `❌ | Bài hát đó không có trong hàng đợi! Vui lòng thử lại!`);
      //remove all tracks to the jumped song
      player.queue.remove(0, Number(args[0]) - 1);
      //stop the player
      player.stop();
      //Send Success Message
      return client.sendTime(message.channel, `⏭ Đã bỏ qua \`${Number(args[0] - 1)}\` nhạc`);
    } catch (e) {
      console.log(String(e.stack).bgRed);
      client.sendError(message.channel, "Đã xảy ra sự cố.");
    }
  },
  SlashCommand: {
    options: [
      {
        name: "position",
        value: "[position]",
        type: 4,
        required: true,
        description: "Bỏ qua một bài hát cụ thể trong hàng đợi",
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
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const voiceChannel = member.voice.channel;
      let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
      if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Bạn phải ở trong một kênh thoại để sử dụng lệnh này.**");
      if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `:x: | *Bạn phải ở cùng kênh thoại với tôi để sử dụng lệnh này!**`);
      let CheckNode = client.Manager.nodes.get(client.config.Lavalink.id);
      if (!CheckNode || !CheckNode.connected) {
        return client.sendTime(interaction, "❌ | **Lavalink node not connected**");
      }

      let player = client.Manager.create({
        guild: interaction.guild_id,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channel_id,
        selfDeafen: false,
      });

      try {
        if (!interaction.data.options) return client.sendTime(interaction, `**Cách sử dụng**: \`${GuildDB.prefix}skipto <number>\``);
        let skipTo = interaction.data.options[0].value;
        //if the wished track is bigger then the Queue Size
        if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)) return client.sendTime(interaction, `❌ | Bài hát đó không có trong hàng đợi! Vui lòng thử lại!`);

        player.stop(skipTo);
        //Send Success Message
        return client.sendTime(interaction, `⏭ Đã bỏ qua \`${Number(skipTo)}\` nhạc`);
      } catch (e) {
        console.log(String(e.stack).bgRed);
        client.sendError(interaction, "Đã xảy ra sự cố.");
      }
    },
  },
};
