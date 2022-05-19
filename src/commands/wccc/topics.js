import {
	Client,
	Interaction,
	Message,
	MessageCollector
} from 'discord.js';

import { createPromptCollector } from '../../handlers/utils.js';

import presences from '../../handlers/presences.js';
import controller from './assets/controller.js';

import getElement from './assets/elements.js';
import getComponent from './assets/components.js';

import { topics as getMessage } from './assets/messages.js';

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default async (client, interaction) => {
	// check state
	if (!controller.checkState(interaction)) return;

	// make collector accessible
	controller.startCollectingTopics(interaction);

	// show default message
	const embed = getElement.embeds.topicsMain(client);
	// const embed = {
	// 	...getElement.embeds.default(client),
	// 	...getMessage.main(),
	// };

	await interaction.reply({
		embeds: [embed]
	});

	// update client
	client.user.setPresence(presences.getTopicTime());

	// await events
	controller.topicCollector.on('collect', collectTopic);
	controller.topicCollector.on('end', evaluateTopics.bind(null, client, interaction));
};

/**
 * @param {MessageCollector} collector
 * @param {Message} message
 * @returns
 */
const collectTopic = async (message) => {
	const topic = controller.validateTopic(message.content);
	const reply = getElement.replies.ephemeral();

	if (!topic) {
		reply.content = getMessage.userPrompt();
		message.reply(reply);
		return;
	}

	// listen for incoming messages
	const promptCollector = createPromptCollector(message);
	reply.content = `Do you want to submit: **${topic}**`;
	reply.components = getComponent.prompt();

	// assign sent message to edit it afterwards
	const sent = await message.reply(reply);

	// listen for user input
	promptCollector.on('end', async (collected, reason) => {

		if (reason === 'time' || collected.first().customId === 'prompt_cancel') {
			reply.content = (reason === 'time') ? getMessage.userPrompt(reason) : getMessage.userPrompt('canceled');
			reply.components = [];
			await sent.edit(reply);
			return;
		}

		// submit topic
		// controller checks amount of collected topics
		// and stops the collector
		if (collected.first().customId === 'prompt_confirm') {
			controller.submitTopic(topic, message.author);
			message.react('✅');
		}

		await sent.delete();
	});
};

const evaluateTopics = async (client, interaction) => {
	// update controller
	controller.stopCollectingTopics();

	// notify users
	await interaction.channel.send({
		content: getMessage.collected(controller.topics),
	});

	// notify 'moderator'
	/** @todo notification role? */
	await interaction.followUp({
		content: getMessage.notification(interaction.user.id, controller.topics),
		ephemeral: true
	});

	// update bot info
	client.user.setPresence(presences.getDefault(client));
};