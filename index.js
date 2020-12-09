require(`dotenv`).config();
const Discord = require(`discord.js`);
const client = new Discord.Client();
const fs = require('fs');
const requireAll = require(`require-all`);

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}


const files = requireAll({
    dirname: `${__dirname}/events`,
    filter: /^(?!-)(.+)\.js$/
});

for (const name in files) {
    const event = files[name];
    client.on(name, event.bind(null, client));
}

const token = process.env.DISCORD_TOKEN;

client.login(token);