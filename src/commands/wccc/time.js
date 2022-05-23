import { Client, Interaction } from 'discord.js';

import voting from './controllers/voting.js';
import messages, {getErrorReply} from './assets/messages.js';

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default async (client, interaction) => {
	let content = 'meh';

	// check controller state
	if (!voting.state) {
		content = messages.voting.time();
	}

	// topic suggestion time is taking place
	if (voting.state && voting.topicCollector) {
		content = messages.topics.time(voting.timestamp);
	}

	// voting time is taking place
	if (voting.state && voting.voteCollector) {
		content = messages.voting.time(voting.timestamp);
	}

	try {
		// send reply
		await interaction.reply({ content });

	} catch (error) {
		// send error
		console.error(error);
		await interaction.reply(getErrorReply());
	}
};