import { Client, Interaction, Message, MessageCollector } from 'discord.js';
import presences from '../../presences.js';
import controller from './assets/controller.js';
import { getPromptComponents } from './assets/elements.js';
import customIds from './assets/identifiers.js';
import settings from './assets/settings.js';
import { topicTexts } from './assets/texts.js';
import { createPromptCollector, validateTopic } from './assets/utils.js';

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default async (client, interaction) => {
	// check state
	if (!controller.check(interaction)) return;

	// make collector accessible
	controller.topicCollector = interaction.channel.createMessageCollector({
		filter: (msg) => msg.content.startsWith('topic'),
		time: settings[customIds.config[0]],
	});

	// show default message
	await interaction.reply({
		content: topicTexts.start,
	});

	// update client
	client.user.setPresence(presences.getTopicTime());

	controller.topicCollector.on('collect', collectTopic.bind(null, controller.topicCollector));
	controller.topicCollector.on('end', evaluateTopics.bind(null, client, interaction));
};

const createTopicData = (content) => {
	return {
		content,
		reacted: false,
		emoji: undefined,
		votes: 0,
	}
}

/**
 * @param {MessageCollector} collector
 * @param {Message} message
 * @returns
 */
const collectTopic = async (collector, message) => {
	const topic = validateTopic(message.content);
	const reply = {
		content: undefined,
		ephemeral: true,
		components: [],
	};

	if (!topic) {
		reply.content = topicTexts.onPrompt();
		message.reply(reply);
		return;
	}

	// listen for incoming messages
	const promptCollector = createPromptCollector(message);
	reply.content = `Do you want to submit: **${topic}**`;
	reply.components = getPromptComponents();

	// assign sent message to edit it afterwards
	const sent = await message.reply(reply);

	// listen for user input
	promptCollector.on('end', async (collected, reason) => {

		if (reason === 'time' || collected.first().customId === 'prompt_cancel') {
			reply.content = (reason === 'time') ? topicTexts.onPrompt(reason) : topicTexts.onPrompt('canceled');
			reply.components = [];
			await sent.edit(reply);
			return;
		}

		if (collected.first().customId === 'prompt_confirm') {
			/** @todo create topic data */
			// console.log(controller.topics);
			controller.topics.push(createTopicData(topic));
			message.react('✅');
		}

		if (controller.topics.length >= settings[customIds.config[1]]) {
			collector.stop('amount');
		}

		await sent.delete();
	});
};

const evaluateTopics = async (client, interaction, collected, reason) => {
	// update controller
	controller.stop();

	if (collected.size === 0) {
		reason = 'none';
		/** @todo reset controller? */
		controller.state.index = 0;
	}

	// notify users
	await interaction.channel.send({
		content: topicTexts.onEndCollecting(reason),
	});

	// notify 'moderator'
	/** @todo notification role? */
	await interaction.followUp({
		content: topicTexts.onEndCollectingNotification(interaction.user.id),
		ephemeral: true
	});

	// update bot info
	client.user.setPresence(presences.getDefault(client));
};