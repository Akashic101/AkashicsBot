/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

module.exports = {
	name: `join`,
	description: "Emits the event guildMemberAdd",
	aliases: ['guildmemberadd'],
	color: '#1f55c1',
	execute(client, message, args) {
		message.client.emit(`guildMemberAdd`, message.member);
	},
};