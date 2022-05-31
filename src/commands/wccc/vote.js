import { Constants } from 'discord.js';

// Controllers
import settings from './controllers/settings.js';
import voting from './controllers/voting.js';
import { customIds } from './assets/identifiers.js';

// Utils
import { getPromptComponents } from './assets/components.js';

// Contents
import presences from './assets/presences.js';
import { voting as messages } from './assets/messages.js';

export const description = `Starts the voting.`;

export default async (client, interaction) => {
	// check state
	if (!voting.checkState(interaction)) return;

	// send 'thinking ...'
	const sent = await interaction.deferReply({ fetchReply: true });

	// send topics and listen to emoji reactions from voting-moderator
	// has to be done via dm
	// bc ephemeral messages don't allow emoji reactions :(
	const created = await sendDirectMessages(interaction.user);

	// cancel if necessary
	if (!created) {
		await sent.delete();
		return;
	}

	// notify users to give their votes
	const embed = voting.getVotingEmbed(client);

	// notify users to vote a topic
	await interaction.editReply({
		embeds: [embed]
	});

	// add emojis to reply
	await voting.startCollectingVotes(sent);

	voting.voteCollector.on('end', evaluateVotes.bind(null, client, interaction));

	// update client
	client.user.setPresence(presences.getVotingTime());
};

const evaluateVotes = async (client, interaction, collected) => {
	const filterCollected = (c) => voting.emojis.includes(c.emoji.toString());
	const sortCollected = (a, b) => b.count - a.count;

	const sorted = collected.filter(filterCollected).sort(sortCollected);
	const final = sorted.filter((c) => c.count === sorted.first().count);

	if (final.size > 1) {
		// it's a draw
		const sent = await interaction.followUp({
			content: messages.draw(settings.getValue(customIds.config[2]))
		});
		const finalEmojis = final.reduce((r, c) => [...r, c.emoji.toString()], []);
		const finalTopics = voting.topics.filter((t) => finalEmojis.includes(t.emoji));

		voting.stopCollectingVotes();
		await voting.startCollectingVotes(sent, finalTopics);

		voting.voteCollector.on('end', evaluateVotes.bind(null, client, interaction));

		console.log(voting.state);
		console.log(voting.topicCollector);

		return;
	}

	// add counts
	sorted.forEach((c) => voting.topics.filter((t) => t.emoji === c.emoji.toString())[0].votes = c.count);

	const winner = voting.topics.filter((t) => t.emoji === final.first().emoji.toString())[0];

	await interaction.followUp({
		content: messages.ended(winner),
	});

	// create notion page and clear topics
	voting.stopCollectingVotes(winner);

	// update bot info
	client.user.setPresence(presences.getDefault(client));
};

//////////////////////////////////////////////////////////// direct message

const sendDirectMessages = async (user) => {
	return new Promise(async (resolve) => {
		const directMessage = await user.send('**Please react with an emoji:**');
		const reactionCollectors = [];

		for (const topic of voting.topics) {
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
				voting.submitReaction(topic, reaction);

				// check if all sent messages have a reaction
				if (!voting.evaluateReactions()) return;

				// check duplicates
				if (voting.checkReactionDuplicates()) {
					await directMessage.edit('**There are duplicates**. Please use different emojis.');
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
		// collect prompt button interaction
		const promptCollector = directMessage.channel.createMessageComponentCollector({
			componentType: Constants.MessageComponentTypes.BUTTON,
			time: 1000 * 30,
			max: 1
		});

		// send and fetch preview message with prompt buttons to delete afterwards
		const sent = await user.send({
			content: `**Preview**\n${voting.getTopicsList()}\n**Do you want to start the voting??**`,
			components: getPromptComponents(),
		});

		// reset timer after the message has been sent
		promptCollector.resetTimer();

		// check clicked button
		promptCollector.on('end', async (collected) => {
			const created = (collected.size > 0 && collected.first().customId === customIds.prompt[3]);

			// clicked cancel or time is over
			if (!created) voting.resetReactions();

			// delete preview message
			await sent.delete();

			// resolve promise
			resolve(created);
		});
	});
};