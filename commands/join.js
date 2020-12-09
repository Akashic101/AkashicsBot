/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

module.exports = {
	name: `join`,
	execute(client, message, args) {
		message.client.emit(`guildMemberAdd`, message.member);
	},
};