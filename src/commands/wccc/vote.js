import {
	Client,
	Constants,
	Interaction
} from 'discord.js';

import presences from '../../handlers/presences.js';
import controller from './assets/controller.js';
import customIds from './assets/identifiers.js';

import getElement from './assets/elements.js';


// import { evaluateTopicEmojis, hasEmojiDuplicates } from './assets/utils.js';

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default async (client, interaction) => {
	// check state
	if (!controller.checkState(interaction)) return;

	// send 'thinking ...'
	const sent = await interaction.deferReply({ fetchReply: true });

	// send topics and listen to emoji reactions from voting-moderator
	// has to be done via dm
	// bc ephemeral messages don't allow emoji reactions :(
	const voting = await sendDirectMessages(interaction.user);

	if (!voting) {
		await sent.delete();
		return;
	}

	// notify users to give their votes
	const embed = getElement.embeds.votingMain(client, controller.topics);

	// notify users to vote a topic
	await interaction.editReply({
		embeds: [embed]
	});

	// add emojis to reply
	await controller.startCollectingVotes(sent);

	controller.voteCollector.on('end', evaluateVotes.bind(null, client, interaction));

	// update client
	client.user.setPresence(presences.getVotingTime());
};

const evaluateVotes = async (client, interaction, collected) => {
	const emojis = controller.topics.map((t) => t.emoji);
	const filter = (c) => emojis.includes(c.emoji.toString());
	const sorter = (a, b) => b.count - a.count;
	const sorted = collected.filter(filter).sort(sorter);
	const count = sorted.first().count;
	const isDraw = sorted.filter((c) => c.count === count).size > 1;

	const embed = getDefaultEmbed(client);

	if (isDraw) {
		embed.title = '**It\'s a draw!**';
		embed.description = `You have another ${controller.settings[customIds.config[2]]} to vote a winner.`;
		const sent = await interaction.followUp({
			embeds: [embed]
		});
		/** @error .map is not a function */
		const finalEmojis = sorted.values().map((s) => s.emoji.toString())
		const finalTopics = controller.topics.filter((t) => finalEmojis.includes(t.emoji));
		controller.startCollectingVotes(sent, finalTopics);
		return;
	}

	const winner = controller.topics.filter((t) => t.emoji === sorted.first().emoji.toString());
	embed.title = '**Looks like we have a winner!**';
	embed.description = `The topic of this week is:\n${winner.emoji} **${winner.content}**\nwith ${winner.votes} votes.`;

	await interaction.followUp({
		embeds: [embed]
	});

	// update bot info
	client.user.setPresence(presences.getDefault(client));
};

//////////////////////////////////////////////////////////// direct message

const sendDirectMessages = async (user) => {
	return new Promise(async (resolve) => {
		const directMessage = await user.send('**Please react with an emoji:**');
		const reactionCollectors = [];

		for (const topic of controller.topics) {
			// send topics as a single message
			const message = await user.send({
				content: topic.content,
			});
			// create reaction collector for each message
			const collector = message.createReactionCollector({
				time: 1000 * 60 * 10, // 10 minutes
			});

			reactionCollectors.push(collector);

			collector.on('collect', async (reaction) => {
				// assign emoji to topic
				controller.submitReaction(topic, reaction);

				// check if all sent messages have a reaction
				if (!controller.evaluateReactions()) return;

				// check duplicates
				if (controller.checkReactionDuplicates()) {
					await directMessage.edit('**There are duplicates**.\nPlease use different emojis.');
					return;
				}

				// send a prompt when all sent messages have a reaction
				// promise prompt interaction
				const resolvedPrompt = await sendPrompt(directMessage, user);
				const resolvedMessage = (resolvedPrompt)
					? 'The Voting has started!'
					: 'Did not start the voting. Please use `/wccc vote` again.';

				// stop collectors and delete sent messages
				for (const reactionCollector of reactionCollectors) {
					await reactionCollector.message.delete();
					reactionCollector.stop();
				}
				directMessage.edit(resolvedMessage);

				resolve(resolvedPrompt);
			});
		}
	});
};


const sendPrompt = async (directMessage, user) => {
	return new Promise(async (resolve) => {
		const reply = {
			content: getPreviewContent(),
			components: getPromptComponents(),
		};
		const promptCollector = directMessage.channel.createMessageComponentCollector({
			componentType: Constants.MessageComponentTypes.BUTTON,
			time: 1000 * 30,
			max: 1
		});

		const sent = await user.send(reply);
		let created = false;

		promptCollector.resetTimer();
		promptCollector.on('end', async (collected) => {
			if (collected.size > 0 && collected.first().customId === 'prompt_confirm') created = true;
			await sent.delete();
			resolve(created);
		});
	});
};

const getPreviewContent = () => {
	return `**Preview**\n${getVotingListContent()}\n**Do you want to start the voting??**`;
};

const getVotingListContent = () => {
	return controller.topics.reduce((result, topic) => {
		return result += topic.emoji + ' ' + topic.content + '\n';
	}, '');
};