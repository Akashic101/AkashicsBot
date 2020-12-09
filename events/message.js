var channels = require('../json/channels.json');

var prefix = channels.prefix

module.exports = async (client, message) => {

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!message.content.startsWith(prefix) || message.author.bot || message.author.self || !client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    command.execute(client, message, args);

};