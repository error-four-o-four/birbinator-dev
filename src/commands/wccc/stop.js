import { Client, Interaction } from 'discord.js';
import presences from '../../handlers/presences.js';
import voting from './controllers/voting.js';
// import controller from './assets/controller.js';
import { getEphemeralReply } from './assets/elements.js';

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default async (client, interaction) => {
	const reply = getEphemeralReply()

	// check controller state
	if (!voting.state) {
		reply.content = `Nothing to do`;
	}

	// topic suggestion time is taking place
	if (voting.state && voting.topicCollector) {
		voting.topicCollector.stop('manually');
		reply.content = `Ended Topic Suggestion Time manually.`;
	}

	// voting time is taking place
	if (voting.state && voting.voteCollector) {
		voting.voteCollector.stop('manually');
		reply.content = `Ended Voting Time manually.`;
	}

	// send reply
	await interaction.reply(reply);

	// update bot info
	client.user.setPresence(presences.getDefault(client));
};