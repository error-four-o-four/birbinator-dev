import { Client, Interaction } from 'discord.js';
import presences from '../../handlers/presences.js';
import controller from './assets/controller.js';
import { getEmptyEphemeralReply } from './assets/elements.js';

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default async (client, interaction) => {
	const reply = getEmptyEphemeralReply()

	// check controller state
	if (!controller.state) {
		reply.content = `Nothing to do`;
	}

	// topic suggestion time is taking place
	if (controller.state && controller.topicCollector) {
		controller.topicCollector.stop('manually');
		reply.content = `Ended Topic Suggestion Time manually.`;
	}

	// voting time is taking place
	if (controller.state && controller.voteCollector) {
		controller.voteCollector.stop('manually');
		reply.content = `Ended Voting Time manually.`;
	}

	// send reply
	await interaction.reply(reply);

	// update bot info
	client.user.setPresence(presences.getDefault(client));
};