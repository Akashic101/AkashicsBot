const {
    Menu
} = require('discord.js-menu')
const pjson = require(`../package.json`);
const Discord = require(`discord.js`);
module.exports = {
    name: 'socials',
    description: 'Sends out a menu linking to my socials',
    color: '#c563df',
    execute(client, message, args) {

        const instagram = new Discord
            .MessageAttachment('./images/Instagram.png', 'instagram.png');

        const twitch = new Discord
            .MessageAttachment('./images/Twitch.png', 'twitch.png');

        let helpMenu = new Menu(message.channel, message.author.id, [{
                name: 'main',
                content: new Discord.MessageEmbed()
                    .setTitle('Social Media Menu')
                    .setDescription('Here you will find all of my socials')
                    .addFields({
                        name: 'Twitch',
                        value: '🟣',
                        inline: true
                    }, {
                        name: 'Youtube',
                        value: '🟡',
                        inline: true
                    })
                    .setTimestamp()
                    .setFooter(`Akashic's Bot V.` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`),
                reactions: {
                    '⏹': 'delete',
                    '🟣': 'twitch',
                    '🟡': 'instagram'
                }
            },
            {
                name: 'twitch',
                content: new Discord.MessageEmbed()
                    .setTitle('Twitch')
                    .setURL('https://www.twitch.tv/akashic_101')
                    .attachFiles(twitch)
                    .setImage('attachment://twitch.png')
                    .setTimestamp()
                    .setFooter(`Akashic's Bot V.` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`),
                reactions: {
                    '◀': 'first'
                }
            },
            {
                name: 'instagram',
                content: new Discord.MessageEmbed()
                    .setTitle('Instagram')
                    .setURL('https://www.instagram.com/akashic101/')
                    .attachFiles(instagram)
                    .setImage('attachment://instagram.png')
                    .setTimestamp()
                    .setFooter(`Akashic's Bot V.` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`),
                reactions: {
                    '◀': 'first'
                }
            }
        ])
        helpMenu.start()
    },

};