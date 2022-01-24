const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const levels = {
    none: 0.0,
    low: 0.2,
    medium: 0.3,
    high: 0.35,
};
module.exports = {
    name: "bassboost",
    description: "Bật hiệu ứng âm thanh tăng cường âm trầm",
    usage: "<|low|medium|high>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["bb", "bass"],
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

        if (!args[0]) return client.sendTime(message.channel, "**Vui lòng cung cấp mức bassboost. \nCác cấp độ khả dụng:** `none`, `low`, `medium`, `high`"); //if the user do not provide args [arguments]

        let level = "none";
        if (args.length && args[0].toLowerCase() in levels) level = args[0].toLowerCase();

        player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));

        return client.sendTime(message.channel, `✅ | **Mức âm bassboost được đặt thành** \`${level}\``);
    },
    SlashCommand: {
        options: [
            {
                name: "level",
                description: `Vui lòng cung cấp mức bassboost. Các cấp độ khả dụng: low, medium, high, or none`,
                value: "[level]",
                type: 3,
                required: true,
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
            const levels = {
                none: 0.0,
                low: 0.2,
                medium: 0.3,
                high: 0.35,
            };

            let player = await client.Manager.get(interaction.guild_id);
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);
            const voiceChannel = member.voice.channel;
            if (!player) return client.sendTime(interaction, "❌ | **Không có gì đang phát ngay bây giờ...**");
            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Bạn phải ở trong một kênh thoại để sử dụng lệnh này.**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(voiceChannel)) return client.sendTime(interaction, ":x: | **Bạn phải ở cùng kênh thoại với tôi để sử dụng lệnh này!**");
            if (!args) return client.sendTime(interaction, "**Please provide a bassboost level. \nCác cấp độ khả dụng:** `none`, `low`, `medium`, `high`"); //if the user do not provide args [arguments]

            let level = "none";
            if (args.length && args[0].value in levels) level = args[0].value;

            player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));

            return client.sendTime(interaction, `✅ | **Đặt mức bassboost thành** \`${level}\``);
        },
    },
};
