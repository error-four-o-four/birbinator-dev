import messages, { getEphemeralReply, getEmbed, } from '../assets/messages.js';
import { createNotionPage } from './notion.js';

import { customIds } from '../assets/identifiers.js';
import settings from './settings.js';

// keep track of the topics and votings
let timeoutIds = [];
let timestamp = 0;
let active = false;

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
	// 	emoji: undefined,
	// 	votes: 0,
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
	// 	emoji: undefined,
	// 	votes: 0,
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
	// 	content: 'three',
	// 	hasEmoji: false,
	// 	emoji: undefined,
	// 	votes: 0,
	// }
];

let topicCollector;
let voteCollector;

const startCollectingTopics = (channel) => {
	topicCollector = channel.createMessageCollector({
		filter: (msg) => msg.content.startsWith('topic'),
		time: settings.getValue(customIds.config[0]),
	});

	// set timestamp of the end
	timestamp = new Date(Date.now() + settings.getValue(customIds.config[0]));

	// update state
	active = true;
};
const stopCollectingTopics = () => {
	// update state
	topicCollector = undefined;
	timestamp = undefined;
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
const resetReactions = () => {
	for (const topic of topics) {
		topic.hasEmoji = false;
		topic.emoji = undefined;
	}
};
const evaluateReactions = () => {
	return (topics.filter((t) => t.hasEmoji).length === topics.length);
};
const checkReactionDuplicates = () => topics.reduce((r, c, i, a) => {
	return (i === a.length - 1) ? r : (r) ? r : a.slice(i + 1).reduce((s, o) => {
		return (s) ? s : (c.emoji === o.emoji);
	}, false);
}, false);

///////////////////////////////////////////////////////////////////// vote.js

// pass sliced topics as param in case of a draw
const startCollectingVotes = async (message, _topics = topics) => {
	voteCollector = message.createReactionCollector({
		time: settings.getValue(customIds.config[2])
	});

	// set timestamp of the end
	timestamp = new Date(Date.now() + settings.getValue(customIds.config[2]));

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
const stopCollectingVotes = (winner) => {
	voteCollector = undefined;
	timestamp = undefined;

	// for (const timeoutId of timeoutIds) {
	// 	clearTimeout(timeoutId);
	// }

	if (winner) {
		const data = {
			topic: winner.content,
			emoji: winner.emoji,
			suggested_by: winner.from.username,
			suggested_topics: topics.map((t) => `${t.content} (${t.votes})`).join(', '),
		}
		createNotionPage(data);
		topics = [];
	}

	// update state
	active = false;
};

/////////////////////////////////////////////////////////////////////

const getTopicSettings = () => {
	return [
		settings.getValue(customIds.config[0]),
		settings.getValue(customIds.config[1]),
	];
};

const getTopicsEmbed = (client) => {
	return getEmbed(client, {
		title: messages.topics.title,
		description: messages.topics.settings(...getTopicSettings()) + messages.topics.description
	});
};
const getTopicsList = () => {
	return topics.reduce((result, topic) => {
		return result += topic.emoji + ' ' + topic.content + '\n';
	}, '');
};
const getVotingEmbed = (client) => {
	return getEmbed(client, {
		title: messages.voting.title,
		description: messages.voting.description + getTopicsList() + messages.voting.settings(settings.getValue(customIds.config[2]))
	});
};

///////////////////////////////////////////////////////////////////// EXPORT

export default {
	checkState,
	get state() {
		return active;
	},
	get timestamp() {
		return timestamp;
	},
	get timeoutIds() {
		return timeoutIds;
	},

	get topics() {
		return topics;
	},
	get topicCollector() {
		return topicCollector;
	},
	get emojis() {
		return topics.map((t) => t.emoji)
	},
	startCollectingTopics,
	stopCollectingTopics,
	validateTopic,
	submitTopic,
	submitReaction,
	resetReactions,
	evaluateReactions,
	checkReactionDuplicates,

	get voteCollector() {
		return voteCollector;
	},
	startCollectingVotes,
	stopCollectingVotes,

	getTopicsEmbed,
	getTopicsList,
	getVotingEmbed,
};