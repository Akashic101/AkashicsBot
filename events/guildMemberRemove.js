const pjson = require(`../package.json`);
const Sequelize = require('sequelize');
const Discord = require(`discord.js`);
const Canvas = require(`canvas`);
const fs = require(`fs`);

var channels = require('../json/channels.json');

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
        defaultValue: 1
    }
});

memberModel.sync();

module.exports = async (client, member) => {

    await memberModel.update({
        member: 0
    }, {
        where: {
            userID: member.id
        }
    });

    const canvas = Canvas.createCanvas(1800, 900);
    const ctx = canvas.getContext('2d');

    const applyText = (canvas, text) => {

        const ctx = canvas.getContext('2d');
        let fontSize = 70;
        do {
            ctx.font = `${fontSize -= 10}px sans-serif`;
        } while (ctx.measureText(text).width > canvas.width - 300);
        return ctx.font;
    };

    const background = await Canvas.loadImage(`images/MemberEvent.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = '120px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${member.displayName}`, canvas.width / 3.5, canvas.height / 5.5);

    //Tag
    ctx.font = '80px sans-serif';
    ctx.fillText(`${member.user.discriminator}`, canvas.width / 3.5, canvas.height / 2.3);

    //ID
    ctx.fillText(member.id, canvas.width / 2.13, canvas.height / 2.3);

    //Joined At
    joinedAt = new Date(member.joinedAt);

    ctx.font = '100px sans-serif';
    ctx.fillText(`${joinedAt.getDate()}.${joinedAt.getMonth()}.${joinedAt.getFullYear()} at ${joinedAt.getHours()}:${joinedAt.getMinutes()}.${joinedAt.getSeconds()}`, canvas.width / 11, canvas.height / 1.12);

    //Created at At
    var createdAt = new Date(member.user.createdAt);

    ctx.fillText(`${createdAt.getDate()}.${createdAt.getMonth()}.${createdAt.getFullYear()} at ${createdAt.getHours()}:${createdAt.getMinutes()}.${createdAt.getSeconds()}`, canvas.width / 11, canvas.height / 1.4);

    ctx.beginPath();
    ctx.arc(237, 232, 188, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
        format: `jpg`
    }));
    ctx.drawImage(avatar, 55, 55, 370, 370);

    var buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./images/memberLeft_Canvas.png', buffer)

    const attachment = new Discord
        .MessageAttachment('./images/memberLeft_Canvas.png', 'sample.png');
    const embed = new Discord.MessageEmbed()
        .setTitle('Member left')
        .setColor('#dc2013')
        .attachFiles(attachment)
        .setImage('attachment://sample.png')
        .setTimestamp()
        .setFooter(`Akashic's Bot V.` + pjson.version, `https://cdn.discordapp.com/app-icons/683749467304099888/1127276baab40eb23bb680a8a102356b.png`);

    return client.channels.cache.get(channels.log).send(embed);
};