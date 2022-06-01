// https://discord.js.org/#/docs/discord.js/main/class/Formatters?scrollTo=s-roleMention
import { Formatters } from 'discord.js';
import { convertDuration } from '../../../functions/utils.js';
import { channelIds, roleIds } from '../../../config.js';

const notification = Formatters.roleMention(roleIds.notification);

export const getEmbed = (client, options = {}) => {
	return {
		type: 'rich',
		thumbnail: {
			url: client.user.avatarURL(),
		},
		...options,
	};
};

export const getEphemeralReply = (content) => {
	return {
		content,
		embeds: [],
		ephemeral: true,
		components: [],
	};
};

export const getPermissionReply = () => {
	return {
		content: 'Sorry. You\'re not allowed to use this command.',
		ephemeral: true,
	};
};

export const getErrorReply = (reason) => {
	return {
		content: `Oh no. Something went wrong. Please try again.${(reason) ? ' Reason: ' + reason : ''}`,
		ephemeral: true,
	};
};

///////////////////////////////////////////////////////////////////// topics.js

const topicsTitle = `**Alright ${notification} People! It's Topic Suggestion Time**`;

const topicsDescription = `Write \`topic myFancyTopicSuggestion\` in this channel to suggest your Topic. Make sure to write additional content of your suggestion in a seperate message.

The bot will only acknowledge suggestions prefixed with \`topic\` and prompt you to confirm.`;

// controllers/votings.js calls getTopicsEmbed()
// which gets: settings + description
export const topics = {
	title: topicsTitle,
	description: topicsDescription,
	settings(delta, maximum) {
		return `You have ${convertDuration(delta)} to suggest a maximum of ${maximum} topics!\n\n`;
	},
	userTopic(topic) {
		return `Do you want to submit: **${topic}**`;
	},
	userPrompt(reason) {
		return (reason === 'time')
			? 'Time has expired. Please try again.'
			: (reason === 'canceled')
				? 'Mmmkay'
				: 'Oh no. Something went wrong. Please try again.';
	},
	collected(topics) {
		return `**Time is out!**\n${(topics.length)
			? 'Thank you for your suggestions!'
			: 'Nobody suggested a topic. 🤨'}`;
	},
	notification(userId, topics) {
		return `${Formatters.userMention(userId)} **Topic Suggestion Time has ended!**\n${(topics.length)
			? 'Please use `/wccc vote` to create and start the voting.'
			: 'Unfortunately no one suggested a topic. Please use `/wccc topics` again.'}`;
	},
	time(date) {
		const delta = ~~((date.getTime() - Date.now()) / 1000) * 1000;
		return `The Topic Suggestion Time will end in ${convertDuration(delta)}.`;
	}
};

///////////////////////////////////////////////////////////////////// vote.js

const votingTitle = `**Alright ${notification} People!**`;

const votingDescription = `It's Time to vote the topic of this weeks challenge!\n\n`;

// controllers/votings.js calls getVotingEmbed()
// which gets: description + list + settings
export const voting = {
	title: votingTitle,
	description: votingDescription,
	settings(delta) {
		return `\nThe voting ends in **${convertDuration(delta)}**.`;
	},
	draw(delta) {
		return `**It's a draw!**\nYou have another **${convertDuration(delta)}** to vote a winner.`;
	},
	ended(topic) {
		return `**Looks like we have a winner!**\nThe topic of this week is: ${topic.emoji} **${topic.content}**`;
	},
	time(date) {
		// show voting time
		if (date) {
			const delta = ~~((date.getTime() - Date.now()) / 1000) * 1000;
			return `The Voting Time will end in **${convertDuration(delta)}**.`;
		}

		// show challenge review time
		const next = new Date();
		next.setUTCDate(next.getUTCDate() + (7 - next.getUTCDay()));
		next.setUTCHours(15, 0, 0, 0);

		const delta = ~~((next.getTime() - Date.now()) / 1000) * 1000;

		return `Your challenge submissions will be reviewed **${(delta > 86400000)
			? 'on ' + next.toLocaleDateString(undefined, {dateStyle: 'full'})
			: 'in ' + convertDuration(delta)}**.`;
	}
};

///////////////////////////////////////////////////////////////////// faq command

// not implemented
// const faqMessageContent = `The Weekly Creative Code Challenge **#WCCChallenge** is a friendly jam for generative artists and creative coders. Each week, the community suggests topics and we vote for the topic of the week. I review your submissions live on Twitch every Sunday. Everyone is welcome to participate, regardless of background or skill level. Beginners, experts, and everyone in between should feel welcome to share their creations.`;

///////////////////////////////////////////////////////////////////// guide.js

const guideTitle = '**Here are some guidelines for participating in the #WCCChallenge**';
const guideDescription = `- Post your creation in ${Formatters.channelMention(channelIds.submissions)}.

- You are free to (mis)interpret the topic of the week any way that you like

- Post before Sunday at 17:00 Berlin time so I can review your submission live at <https://twitch.tv/sableraph>

- You can post your work in any format but I may only review works that run in a browser

- Possible platforms include p5js editor, openprocessing, shadertoy, twigl, codepen, github pages...

- It is best if the code is editable so I can tweak it and we can learn from it

- You can submit more than one piece if you want but I might only review one of them

- Submissions should fit the topic of the week (see ${Formatters.channelMention(channelIds.voting)})

- You may recycle old work if it fits the topic but I encourage you to submit work made this week

- Consider using the **#WCCChallenge** hashtag if you share your creation on Twitter or Instagram

- Though it is not required, I'm very grateful for mentions of the **#WCCChallenge** in the comments of your code too

- Please don't use copyrighted music in your work so we don't get in trouble with Twitch

- Make it fun! Showing off, coding jokes, and friendly trolling are welcome. This is your show :wink:

:bird: Raphaël`;

/////////////////////////////////////////////////////////////////////

const pastMessageContent = `**You're interested int the topics from the past?**
There you go: [#WCCChallenge Topics Notion](<https://sableraph.notion.site/afe97ee95a1c4e2c9cc524b78aae6e45?v=66edd42672aa41e29d5a1aa8e0dc7cb2>)`;


///////////////////////////////////////////////////////////////////// settings.js

export default {
	topics,
	voting,
	// faqMessageContent,
	guideTitle,
	guideDescription,
	pastMessageContent,
};
