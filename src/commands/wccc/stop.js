import { Client, Interaction } from 'discord.js';
import controller from './assets/controller.js';

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default async (client, interaction) => {
	const reply = {
		content: '',
		ephemeral: true,
	};

	// check controller state
	if (!controller.state.active) {
		reply.content = `Nothing to do`;
	}

	// topic suggestion time is taking place
	if (controller.state.active && controller.state.index === 1) {
		controller.topicCollector.stop('manually');
		reply.content = `Ended Topic Suggestion Time manually.`;
	}

	// topic suggestion time is taking place
	if (controller.state.active && controller.state.index === 3) {
		controller.voteCollector.stop('manually');
		reply.content = `Ended Voting Time manually.`;
	}

	// send reply
	await interaction.reply(reply);
};