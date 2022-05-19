import { Constants } from 'discord.js';
import settings from './wccc/settings.js';
import guide from './wccc/guide.js';
import past from './wccc/past.js';
import topics from './wccc/topics.js';
import vote from './wccc/vote.js';
import stop from './wccc/stop.js';

export const data = {
	name: 'wccc',
	description: `Create a voting! Collect topic suggestions and let users vote with emoji reactions.`,
	options: [
		{
			name: 'settings',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: `Configurates settings.`,
		},
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
			name: 'topics',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: `Starts the Topic Suggestion Time.`,
		},
		{
			name: 'vote',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: `Starts the voting.`,
		},
		{
			name: 'stop',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: `Stops the suggestion or voting time manually.`,
		},
	],
};

const handler = {
	config: settings,
	guide,
	past,
	topics,
	vote,
	stop
};

export const execute = async (client, interaction) => {
	const action = interaction.options.data[0].name;
	/**
	 * @todo permissions -> server settings? 'voting-manager'
	 */
	handler[action](client, interaction);
};