// import logger from '../../../utils.js';
// https://www.npmjs.com/package/emoji-dictionary
import { convertDuration } from '../../../handlers/utils.js';

import customIds from './identifiers.js';
import getElements from './elements.js';

///////////////////////////////////////////////////////////////////// config.js

// the #wccc settings
// topic_time, topics_max, voting_time
const settings = {
	[customIds.config[0]]: 1000 * 60,
	// [customIds.config[0]]: 1000 * 60 * 10, // millis / default: 10 minutes
	[customIds.config[1]]: 5,
	[customIds.config[2]]: 1000 * 60,
	amounts: [
		2, 5, 10, 20
	],
	durations: [
		60, 300, 600, 1800, 3600, 7200, 43200, 86400
	].map((v) => v *= 1000), // convert sec to ms
	timeouts: [
		120, 300, // delta!
	],
};

const labels = {
	[customIds.config[0]]: 'Topic Suggestion Duration',
	[customIds.config[1]]: 'Maximum Topics',
	[customIds.config[2]]: 'Voting Duration',
	[customIds.config[3]]: 'Choose a duration',
	[customIds.config[4]]: 'Choose a maximum amount',
	[customIds.prompt[0]]: 'Exit',
	[customIds.prompt[1]]: 'Back',
	[customIds.prompt[2]]: 'Cancel',
	[customIds.prompt[3]]: 'Confirm',
};

// keep track of the selected values -> /wccc settings
const selection = {
	customId: undefined,
	type: undefined,
	value: undefined,
};
const setSelectionId = (customId) => {
	selection.customId = customId;
};
const getSelectionValue = () => {
	return selection.value;
};
const setSelectionValue = ({ customId, values }) => {
	selection.type = customId;
	selection.value = parseInt(values[0]);
};
const resetSelection = () => {
	for (const key in selection) {
		selection[key] = undefined;
	}
};
const submitSelection = () => {
	const { customId, value } = selection;
	settings[customId] = parseInt(value);
};
const getSettingsDescription = () => {
	return customIds.config.slice(0, 3).reduce((result, id, i) => {
		return result += `${labels[id]}: ${(i === 1) ? settings[id] : convertDuration(settings[id])}\n`;
	}, 'What do you want do change?\n\n');
}
const getSettingsDescriptionValue = (customId) => {
	return `Please choose a value for ${labels[customId]} from the menu.`
}

///////////////////////////////////////////////////////////////////// topics.js

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

const checkState = (interaction) => {
	const reply = getElements.replies.ephemeral();
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

const startCollectingTopics = ({ channel }) => {
	topicCollector = channel.createMessageCollector({
		filter: (msg) => msg.content.startsWith('topic'),
		time: settings[customIds.config[0]],
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

	if (topics.length >= settings[customIds.config[1]]) {
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


///////////////////////////////////////////////////////////////////// vote.js

let voteCollector;

// pass sliced topics as param in case of a draw
const startCollectingVotes = async (message, _topics = topics) => {
	voteCollector = message.createReactionCollector({
		time: settings[customIds.config[2]]
	});

	const timeouts = settings.timeouts.filter((t) => t < settings[customIds.config[2]]);

	for (const timeout of timeouts) {
		const delay = settings[customIds.config[2]] - timeout;
		const timeoutId = setTimeout(() => message.channel.send({
			content: `**${convertDuration(timeout)} left to vote a topic for this weeks challenge!**`
		}), delay);
		timeoutIds.push(timeoutId);
	}

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

export default {
	get settings() {
		return settings;
	},
	get settingsDescription() {
		return getSettingsDescription()
	},
	get settingsDescriptionValue() {
		return getSettingsDescriptionValue()
	},
	get labels() {
		return labels;
	},
	setSelectionId,
	setSelectionValue,
	getSelectionValue,
	resetSelection,
	submitSelection,

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

	get voteCollector() {
		return voteCollector;
	},
	startCollectingVotes,
	stopCollectingVotes,
};