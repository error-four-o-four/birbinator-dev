import {
	getEphemeralReply,
	getEmbed,
	topics as topicsMessages,
	voting as votingMessages,
} from '../assets/messages.js';

import { customIds } from '../assets/identifiers.js';
import settings from './settings.js';

// keep track of the topics and votings
let timeoutIds = [];
let active = false;

let topics = [
	// {
	// 	from: {
	// 		id: '790552703058837514',
	// 		bot: false,
	// 		system: false,
	// 		flags: [],
	// 		username: 'error-four-o-four',
	// 		discriminator: '7727',
	// 		avatar: 'ec7dbe154a2812b3db4df5d3e9605d2c',
	// 		banner: undefined,
	// 		accentColor: undefined
	// 	},
	// 	content: 'one',
	// 	hasEmoji: false,
	// 	emoji: undefined
	// },
	// {
	// 	from: {
	// 		id: '790552703058837514',
	// 		bot: false,
	// 		system: false,
	// 		flags: [],
	// 		username: 'error-four-o-four',
	// 		discriminator: '7727',
	// 		avatar: 'ec7dbe154a2812b3db4df5d3e9605d2c',
	// 		banner: undefined,
	// 		accentColor: undefined
	// 	},
	// 	content: 'two',
	// 	hasEmoji: false,
	// 	emoji: undefined
	// }
];

let topicCollector;
let voteCollector;

const checkState = (interaction) => {
	const reply = getEphemeralReply();
	const subCmd = interaction.options.getSubcommand();

	if (active) {
		reply.content = (topics.length)
			? ':warning: A vote is already taking place.'
			: ':warning: Topic suggestion time is already taking place.';
		interaction.reply(reply);
		return false;
	}

	// called /wccc topics twice
	if (!active && subCmd === 'topics' && topics.length > 0) {
		reply.content = ':warning: Already collected topic suggestions. Use `/wccc vote` to create and start.';
		interaction.reply(reply);
		return false;
	}

	// called /wccc vote before calling /wccc topics
	if (!active && subCmd === 'vote' && topics.length === 0) {
		reply.content = ':warning: No topics. Use `/wccc topics` to collect topic suggestions.';
		interaction.reply(reply);
		return false;
	}

	return true;
};

const startCollectingTopics = (channel) => {
	topicCollector = channel.createMessageCollector({
		filter: (msg) => msg.content.startsWith('topic'),
		time: settings.getValue(customIds.config[0]),
	});

	// update state
	active = true;
};
const stopCollectingTopics = () => {
	topicCollector = undefined;

	// update state
	active = false;
};
const validateTopic = (content) => {
	content = content.trim().replace(/\s\s+/g, ' ').replace(/\r?\n/g, ' ');
	return content.split(' ').splice(1).join(' ');
};
const submitTopic = (topic, author) => {
	if (author.bot) return;

	const data = {
		from: author,
		content: topic,
		hasEmoji: false,
		emoji: undefined,
	};
	topics.push(data);

	if (topics.length >= settings.getValue(customIds.config[1])) {
		topicCollector.stop('amount');
	}
};
const submitReaction = (topic, reaction) => {
	topic.hasEmoji = true;
	topic.emoji = reaction.emoji.toString();
};
const evaluateReactions = () => {
	return (topics.filter((t) => t.hasEmoji).length === topics.length);
};
const checkReactionDuplicates = () => topics.reduce((r, c, i, a) => {
	return (i === a.length - 1) ? r : (r) ? r : a.slice(i + 1).reduce((s, o) => {
		return (s) ? s : (c.emoji === o.emoji);
	}, false);
}, false);

const getTopicsEmbed = (client) => {
	const { title, description } = topicsMessages;
	return getEmbed(client, { title, description });
};
const getTopicsList = () => {
	return topics.reduce((result, topic) => {
		return result += topic.emoji + ' ' + topic.content + '\n';
	}, '');
}

///////////////////////////////////////////////////////////////////// vote.js

// pass sliced topics as param in case of a draw
const startCollectingVotes = async (message, _topics = topics) => {
	voteCollector = message.createReactionCollector({
		time: settings.getValue(customIds.config[2])
	});

	/** @todo */
	// const timeouts = settings.timeouts.filter((t) => t < settings[customIds.config[2]]);

	// for (const timeout of timeouts) {
	// 	const delay = settings[customIds.config[2]] - timeout;
	// 	const timeoutId = setTimeout(() => message.channel.send({
	// 		content: `**${convertDuration(timeout)} left to vote a topic for this weeks challenge!**`
	// 	}), delay);
	// 	timeoutIds.push(timeoutId);
	// }

	for (const topic of _topics) {
		await message.react(topic.emoji);
	}
	// update state
	active = true;
};
const stopCollectingVotes = () => {
	voteCollector = undefined;
	topics = [];

	for (const timeoutId of timeoutIds) {
		clearTimeout(timeoutId);
	}

	/** @todo integrate notions api */
	/** @todo garbage collection? */

	// update state
	active = false;
};

const getVotingEmbed = (client) => {
	const { title, description } = votingMessages;
	return getEmbed(client, { title, description: description + getTopicsList() });
}

export default {
	get timeoutIds() {
		return timeoutIds;
	},
	get state() {
		return active;
	},
	checkState,

	get topics() {
		return topics;
	},
	get topicCollector() {
		return topicCollector;
	},
	startCollectingTopics,
	stopCollectingTopics,
	validateTopic,
	submitTopic,
	submitReaction,
	evaluateReactions,
	checkReactionDuplicates,

	getTopicsEmbed,
	getTopicsList,

	get voteCollector() {
		return voteCollector;
	},
	startCollectingVotes,
	stopCollectingVotes,

	getVotingEmbed,
};