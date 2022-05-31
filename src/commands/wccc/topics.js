// Controller
import voting from './controllers/voting.js';

// Utils
import { createPromptCollector } from '../../functions/utils.js';
import { getPromptComponents } from './assets/components.js'
import { getEphemeralReply } from './assets/messages.js';

// Contents
import presences from './assets/presences.js';
import { topics as messages } from './assets/messages.js';

export const description = `Starts the Topic Suggestion Time.`;

export default async (client, interaction) => {
	// check state
	if (!voting.checkState(interaction)) return;

	// make collector accessible
	voting.startCollectingTopics(interaction.channel);

	// show default message
	const embed = voting.getTopicsEmbed(client);

	await interaction.reply({
		embeds: [embed]
	});

	// update client
	client.user.setPresence(presences.getTopicTime());

	// await events
	voting.topicCollector.on('collect', collectTopic);
	voting.topicCollector.on('end', evaluateTopics.bind(null, client, interaction));
};

const collectTopic = async (message) => {
	const topic = voting.validateTopic(message.content);
	const reply = getEphemeralReply();

	if (!topic) {
		reply.content = messages.userPrompt();
		message.reply(reply);
		return;
	}

	// listen for incoming messages
	const promptCollector = createPromptCollector(message);
	reply.content = messages.userTopic(topic);
	reply.components = getPromptComponents();

	// assign sent message to edit it afterwards
	const sent = await message.reply(reply);

	// listen for user input
	promptCollector.on('end', async (collected, reason) => {

		if (reason === 'time' || collected.first().customId === 'prompt_cancel') {
			reason = (reason === 'time') ? reason : 'canceled';
			reply.content = messages.userPrompt(reason);
			reply.components = [];
			await sent.edit(reply);
			return;
		}

		// submit topic
		// controller checks amount of collected topics
		// and stops the collector
		if (collected.first().customId === 'prompt_confirm') {
			voting.submitTopic(topic, message.author);
			message.react('✅');
		}

		await sent.delete();
	});
};

const evaluateTopics = async (client, interaction) => {
	// update controller
	voting.stopCollectingTopics();

	// notify users
	await interaction.channel.send({
		content: messages.collected(voting.topics),
	});

	// notify 'moderator'
	await interaction.followUp({
		content: messages.notification(interaction.user.id, voting.topics),
		ephemeral: true
	});

	// update bot info
	client.user.setPresence(presences.getDefault(client));
};