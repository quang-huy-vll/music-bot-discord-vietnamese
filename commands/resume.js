const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "resume",
    description: "Tiếp tục phát nhạc",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        let player = await client.Manager.get(message.guild.id);
        if (!player) return client.sendTime(message.channel, "❌ | **Không có gì đang phát ngay bây giờ...**");
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Bạn phải ở trong một kênh thoại để sử dụng lệnh này!**");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **Bạn phải ở cùng kênh thoại với tôi để sử dụng lệnh này!**");

        if (player.playing) return client.sendTime(message.channel, "❌ | **Âm nhạc đã được tiếp tục!**");
        player.pause(false);
        await message.react("✅");
    },

    SlashCommand: {
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

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Bạn phải ở trong một kênh thoại để sử dụng lệnh này**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **Bạn phải ở cùng kênh thoại với tôi để sử dụng lệnh này!**");

            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "❌ | **Không có gì đang phát ngay bây giờ...**");
            if (player.playing) return client.sendTime(interaction, "❌ | **Âm nhạc đã được tiếp tục!**");
            player.pause(false);
            client.sendTime(interaction, "**⏯ Resumed!**");
        },
    },
};
