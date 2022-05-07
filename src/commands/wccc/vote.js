import { Client, Constants, Interaction } from 'discord.js';
import presences from '../../presences.js';
import controller from './assets/controller.js';
import { getDefaultEmbed, getPromptComponents } from './assets/elements.js';
import settings from './assets/settings.js';
import customIds from './assets/identifiers.js';

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default async (client, interaction) => {
	// check state
	if (!controller.check(interaction)) return;

	console.log(controller.state);

	// send 'thinking ...'
	const sent = await interaction.deferReply({ fetchReply: true });

	// send topics and listen to emoji reactions from voting-moderator
	// has to be done via dm
	// bc ephemeral messages don't allow emoji reactions :(
	const voting = await sendDirectMessages(interaction.user);

	if (!voting) {
		/** @todo reset controller? */
		controller.state.index = 2;
		controller.state.active = false;
		await sent.delete();
		return;
	}

	const embed = getDefaultEmbed(client);
	embed.title = '**Time to vote**!';
	embed.description = `These are the topics for the **#WCCChallenge**\n\n${getVotingListContent()}`;

	// notify users to vote a topic
	await interaction.editReply({
		embeds: [embed]
	});

	controller.voteCollector = createVoteCollector(sent);

	// add emojis to reply
	for (const topic of controller.topics) {
		await sent.react(topic.emoji);
	}

	// update client
	client.user.setPresence(presences.getVotingTime());

	controller.voteCollector.on('collect', collectVote);
	controller.voteCollector.on('remove', removeVote);
	controller.voteCollector.on('end', evaluateVotes.bind(null, client, interaction));

	/** @todo integrate notions api */
};

const createVoteCollector = (message) => {
	return message.createReactionCollector({
		time: settings[customIds.config[2]],
		dispose: true,
	});
};

const collectVote = async (reaction) => {
	const topic = controller.topics.filter((topic) => topic.emoji === reaction.emoji.toString())[0];
	topic.votes += 1;
};

const removeVote = async (reaction) => {
	const topic = controller.topics.filter((topic) => topic.emoji === reaction.emoji.toString())[0];
	topic.votes -= 1;
};

const evaluateVotes = async (client, interaction) => {
	const reducer = (result, current) => (current.votes > result.votes) ? current : result;
	const winner = controller.topics.reduce(reducer, controller.topics[0]);

	/** @todo topics with same reaction count */
	console.log(winner);

	/** @todo reset controller? */
	controller.stop();
	controller.state.index = 0;

	const embed = getDefaultEmbed(client);
	embed.title = '**Looks like we have a winner!**';
	embed.description = `The topic of this week is:\n${winner.emoji} **${winner.content}**\nwith ${winner.votes} votes.`;

	await interaction.followUp({
		embeds: [embed]
	});

	controller.topics = [];

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
				/** @todo gnaaa emoji object */
				topic.reacted = true;
				topic.emoji = reaction.emoji.toString();

				if (checkReactions()) return;

				/** @todo check if messages/topics have the same emoji */

				// send a prompt when all messages have a emoji reaction
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
				await directMessage.edit(resolvedMessage);

				resolve(resolvedPrompt);
			});
		}
	});
};

const checkReactions = () => {
	return (controller.topics.filter((t) => !t.reacted).length > 0);
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