const Discord = require(`discord.js`);
const pjson = require(`../package.json`);
const Sequelize = require('sequelize');

var channels = require('../json/channels.json');

var prefix = channels.prefix

const member = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'member.sqlite',
});

const memberModel = member.define('memberModel', {
    userID: {
        type: Sequelize.BIGINT,
        notNull: true,
        unique: true
    },
    username: {
        type: Sequelize.STRING,
        notNull: true,
        unique: true
    },
    createdAt: {
        type: Sequelize.DATE,
        isDate: true
    },
    joinedAt: {
        type: Sequelize.DATE,
        isDate: true
    },
    messages: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    messagesLastMonth: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    member: {
        type: Sequelize.BOOLEAN,
    }
});

memberModel.sync();

module.exports = async (client, message) => {

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!message.author.bot) {
        try {
            const match = await memberModel.findOne({
                where: {
                    userID: message.author.id
                }
            });

            if (match) {
                match.increment('messages');
                match.increment('messagesLastMonth');
            } else {
                const match = await memberModel.create({
                    userID: message.author.id,
                    username: message.author.username,
                    createdAt: message.author.createdAt,
                    joinedAt: message.member.joinedAt,
                    messages: 1,
                    messagesLastMonth: 1,
                });
            }
        } catch (e) {
            return message.channel.send({
                embed: {
                    color: 0,
                    description: `${e}`
                }
            })
        }
    }

    if (!message.content.startsWith(prefix) || message.author.bot || message.author.self) return;

    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    command.execute(client, message, args);
    sendLog(client, command, message);
};

function sendLog(client, command, message) {

    var d = new Date();

    var serverLogEmbed = new Discord.MessageEmbed()
        .setColor(command.color)
        .setTitle(`**${command.name}**`)
        .setDescription(command.description)
        .addFields({
            name: `Username`,
            value: message.member.user.tag,
            inline: true,
        }, {
            name: `Command`,
            value: message.content,
            inline: true,
        }, {
            name: `channel`,
            value: `<#${message.channel.id}>`,
            inline: true,
        }, {
            name: `Date`,
            value: `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} at ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
            inline: true,
        }, {
            name: `link`,
            value: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`,
            inline: true,
        })
        .setThumbnail(message.member.user.displayAvatarURL({
            format: `jpg`
        }))
        .setTimestamp()
        .setFooter(`Akashic's Bot V.` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);

    return client.channels.cache.get(channels.log).send(serverLogEmbed);
}