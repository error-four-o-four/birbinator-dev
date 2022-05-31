import { Constants, Formatters } from 'discord.js';
import { roleIds, channelIds } from '../config.js';
import { getEphemeralReply, getPermissionReply } from './wccc/assets/messages.js';
import { getFiles } from '../functions/utils.js';

export const data = {
	name: 'wccc',
	description: `Create a voting! Collect topic suggestions and let users vote with emoji reactions.`,
	options: [],
};

const createHandler = async (path) => {
	const url = new URL(path, import.meta.url);
	const files = await getFiles(url);
	const actions = {};

	for (const file of files) {
		const name = file.split('.')[0];
		const action = await import(`${url}${file}`);
		actions[name] = action;

		data.options.push({
			name,
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: action.description
		})
	}
	return actions;
}

const handler = await createHandler('./wccc/');

export const execute = async (client, interaction) => {
	const action = interaction.options.data[0].name;

	const isMod = interaction.member.roles.cache.some(role => role.id === roleIds.moderator);
	const modsOnly = 'settings stop topics vote'.split(' ').includes(action);
	const chatOnly = 'past guide'.split(' ').includes(action);
	const isChatChannel = interaction.channelId === channelIds.chat;
	const isVotingChannel = interaction.channelId === channelIds.voting;

	if (modsOnly && !isMod) {
		interaction.reply(getPermissionReply());
		return;
	}

	if (modsOnly && !isVotingChannel) {
		const message = `This is not the right channel. Go to ${Formatters.channelMention(channelIds.voting)}`;
		interaction.reply(getEphemeralReply(message));
		return;
	}

	if (chatOnly && !isChatChannel) {
		const message = `This is not the right channel. Go to ${Formatters.channelMention(channelIds.chat)}`;
		interaction.reply(getEphemeralReply(message));
		return;
	}

	if (action === 'time' && !isChatChannel && !isVotingChannel) {
		const message = `This is not the right channel.`;
		interaction.reply(getEphemeralReply(message));
		return;
	}

	handler[action](client, interaction);
};