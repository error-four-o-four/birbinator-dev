// https://discord.js.org/#/docs/discord.js/main/class/Formatters?scrollTo=s-roleMention
import { Formatters } from 'discord.js';
import controller from './controller.js';

import { notifyId } from '../../../config.js';


export const getErrorMessage = (reason) => {
	return (reason)
		? reason
		: 'Oh no. Something went wrong. Please try again.';
};

///////////////////////////////////////////////////////////////////// topics.js

const topicsTitle = `**Alright ${Formatters.roleMention(notifyId)} People! It's Topic Suggestion Time**`;

const topicsDescription = `Write \`topic myFancyTopicSuggestionName\` in this channel to suggest your Topic. Make sure to write additional content of your suggestion in a seperate message.

The bot will only acknowledge suggestions prefixed with topic and prompt you to confirm.`;

const getTopicsMain = () => {
	return {
		title: topicsTitle,
		description: topicsDescription,
	};
};

const getTopicsUserPrompt = (reason) => {
	return (reason === 'time')
		? 'Time has expired. Please try again.'
		: (reason === 'canceled')
			? 'Mmmkay'
			: 'Oh no. Something went wrong. Please try again.';
};

const getTopicsCollected = (topics) => {
	let content = '**Time is out!**\n';
	content += (topics.length)
	? 'Thank you for your suggestions!'
	: 'Nobody suggested a topic. 🤨'
	return content;
}

const getTopicsCollectedNotification = (id, topics) => {
	let content = `${Formatters.userMention(id)} **Topic Suggestion Time has ended!**\n`;
	content += (topics.length)
	? 'Please use `/wccc vote` to create and start the voting.'
	: 'Unfortunately no one suggested a topic. Please use `/wccc topics` again.'
	return content;
}

export const topics = {
	main: getTopicsMain,
	userPrompt: getTopicsUserPrompt,
	collected: getTopicsCollected,
	notification: getTopicsCollectedNotification,
}

// export const topicTexts = {
// 	onStart: getTopicsMain,
// 	onPrompt: getTopicsUserPrompt,
// 	onEnd: getTopicsCollected,
// 	onEndNotification: getTopicsCollectedNotification
// }

///////////////////////////////////////////////////////////////////// vote.js

const votingTitle = `**Alright ${Formatters.roleMention(notifyId)} People! It's Time to vote the topic of this weeks challenge!**`;

const votingDescription = `These are the topics for the **#WCCChallenge**\n\n`;

const getVotingMain = (topics) => {
	return {
		title: votingTitle,
		description: votingDescription + topics.reduce((result, topic) => {
			return result += topic.emoji + ' ' + topic.content + '\n';
		}, ''),
	}
}
export const voting = {
	main: getVotingMain
}

///////////////////////////////////////////////////////////////////// faq command

const faqMessageContent = `The Weekly Creative Code Challenge **#WCCChallenge** is a friendly jam for generative artists and creative coders. Each week, the community suggests topics and we vote for the topic of the week. I review your submissions live on Twitch every Sunday. Everyone is welcome to participate, regardless of background or skill level. Beginners, experts, and everyone in between should feel welcome to share their creations.`;

///////////////////////////////////////////////////////////////////// guide.js

const guideTitle = '**Here are some guidelines for participating in the #WCCChallenge**';
const guideDescription = `- Post your creation in ${Formatters.channelMention('969317896432009216')}.

- You are free to (mis)interpret the topic of the week any way that you like

- Post before Sunday at 17:00 Berlin time so I can review your submission live at <https://twitch.tv/sableraph>

- You can post your work in any format but I may only review works that run in a browser

- Possible platforms include p5js editor, openprocessing, shadertoy, twigl, codepen, github pages...

- It is best if the code is editable so I can tweak it and we can learn from it

- You can submit more than one piece if you want but I might only review one of them

- Submissions should fit the topic of the week (see :snail:topics-and-voting) (@todo)

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

const getSettingsMain = () => {
	return {
		title: 'These are your WCCC Settings',
		description: 'What do you want do change?\n\n' + controller.settingsDescription,
	}
}

/** @todo */
const getSettingsEditing = (customId) => {
	return {
		title: labels[customId],
		description: 'Please choose a value.',
	};
};
// const getEditingText = (customId) => {
// 	let text = `Please submit a new value `;
// 	text += (customId === customIds[1])
// 		? `<number>.`
// 		: `<number><string:h/m/s> (e.g. \`2 hours\`, \`12min\`, \`30 s\`)`;
// 	return text;
// };

export const settings = {
	main: getSettingsMain,
	edit: getSettingsEditing,

}

export default {
	settings,
	topics,
	voting,
	faqMessageContent,
	guideTitle,
	guideDescription,
	pastMessageContent,
};
