import voting from './controllers/voting.js';
import presences from './assets/presences.js';
import { getEphemeralReply } from './assets/messages.js';

export const description = `Stops the suggestion or voting time manually.`;

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