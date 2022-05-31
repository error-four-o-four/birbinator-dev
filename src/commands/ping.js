import { Client, Interaction } from 'discord.js';

const name = 'ping';
const description = 'Replies with pong.';

export const data = {
	name,
	description,
}

export const execute = async (client, interaction) => {
	const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
	interaction.editReply(`Pong!\nSocket: \`${client.ws.ping}ms\`, Api:\`${sent.createdTimestamp - interaction.createdTimestamp}ms\`.`);
};