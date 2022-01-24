const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "volume",
    description: "Kiểm tra hoặc thay đổi âm lượng hiện tại",
    usage: "<volume>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["vol", "v"],
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
        if (!args[0]) return client.sendTime(message.channel, `🔉 | Âm lượng hiện tại \`${player.volume}\`.`);
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Bạn phải ở trong một kênh thoại để sử dụng lệnh này!**");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **Bạn phải ở cùng kênh thoại với tôi để sử dụng lệnh này!**");
        if (!parseInt(args[0])) return client.sendTime(message.channel, `**Vui lòng chọn một số ** \`1 - 500\``);
        let vol = parseInt(args[0]);
        player.setVolume(vol);
        client.sendTime(message.channel, `🔉 | **Đặt âm lượng thành** \`${player.volume}\``);
    },
    SlashCommand: {
        options: [
            {
                name: "amount",
                value: "amount",
                type: 4,
                required: false,
                description: "Nhập âm lượng từ 1-500. Mặc định là 100.",
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

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | Bạn phải ở trong một kênh thoại để sử dụng lệnh này.");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **Bạn phải ở cùng kênh thoại với tôi để sử dụng lệnh này!**");
            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "❌ | **Không có gì đang phát ngay bây giờ...**");
            if (!args[0].value) return client.sendTime(interaction, `🔉 | Current volume \`${player.volume}\`.`);
            let vol = parseInt(args[0].value);
            if (!vol || vol < 1 || vol > 100) return client.sendTime(interaction, `**Vui lòng chọn một số ** \`1 - 500\``);
            player.setVolume(vol);
            client.sendTime(interaction, `🔉 | Đặt âm lượng thànhthành \`${player.volume}\``);
        },
    },
};
