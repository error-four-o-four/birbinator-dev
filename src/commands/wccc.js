import { Constants, Formatters, Interaction } from 'discord.js';
import { roleIds, channelIds } from '../config.js';
import { getEphemeralReply, getPermissionReply } from './wccc/assets/messages.js';

/** @todo refactor */
import guide from './wccc/guide.js';
import past from './wccc/past.js';
import time from './wccc/time.js';
import settings from './wccc/settings.js';
import stop from './wccc/stop.js';
import topics from './wccc/topics.js';
import vote from './wccc/vote.js';

export const data = {
	name: 'wccc',
	description: `Create a voting! Collect topic suggestions and let users vote with emoji reactions.`,
	options: [
		{
			name: 'guide',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: `Shows some guidelines.`,
		},
		{
			name: 'past',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: `Sends a link to the past topics.`,
		},
		{
			name: 'time',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: `Shows the time left to suggest a topic, to vote or until the stream starts.`,
		},
		{
			name: 'settings',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: `Configurates settings.`,
		},
		{
			name: 'stop',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: `Stops the suggestion or voting time manually.`,
		},
		{
			name: 'topics',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: `Starts the Topic Suggestion Time.`,
		},
		{
			name: 'vote',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: `Starts the voting.`,
		},
	],
};

const handler = {
	guide,
	past,
	time,
	// mods only
	settings,
	stop,
	topics,
	vote,
};

/**
 *
 * @param {*} client
 * @param {Interaction} interaction
 * @returns
 */
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