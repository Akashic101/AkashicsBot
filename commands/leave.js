/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

module.exports = {
	name: 'leave',
	description: 'Emits the event guildMemberRemove',
	color: '#06b2bb',
	execute(client, message, args) {
		message.client.emit(`guildMemberRemove`, message.member);
	},
};