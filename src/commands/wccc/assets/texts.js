import { Formatters } from 'discord.js';
import customIds from './identifiers.js';

import { convertDuration } from './utils.js';

export const labels = {
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

export const getErrorMessage = (reason) => {
	return (reason)
		? reason
		: 'Oh no. Something went wrong. Please try again.';
};

///////////////////////////////////////////////////////////////////// config.js

export const getDefaultContent = (settings) => {
	const title = 'These are your WCCC Settings';
	const description = customIds.config.slice(0, 3).reduce((result, id, i) => {
		return result += `${labels[id]}: ${(i === 1) ? settings[id] : convertDuration(settings[id])}\n`;
	}, 'What do you want do change?\n\n');

	return {
		title,
		description
	};
};

/** @todo */
export const getEditingContent = (customId) => {
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

export const getOnExitText = (reason) => {
	return `Ended settings configuration. ${(reason === 'time') ? 'Time has expired.' : 'By User.'}`;
};

///////////////////////////////////////////////////////////////////// topics.js

// @todo object with methods?? topicTexts
const topicsStartMessageContent = `**Alright 'everyone'! It's Topic Suggestion Time**

Write \`topic myFancyTopicSuggestionName\` in this channel to suggest your Topic.
Make sure to write addiotional content of your suggestion in a seperate message.

(?) The bot will only acknowledge suggestions prefixed with topic and prompt you to confirm.`;

const getTopicPromptText = (reason) => {
	return (reason === 'time')
		? 'Time has expired. Please try again.'
		: (reason === 'canceled')
			? 'Mmmkay'
			: 'Oh no. Something went wrong. Please try again.';
};

const getCollectedTopicsText = (reason) => {
	let content = '**Time is out!**\n\n';
	content += (reason === 'none')
	? 'Nobody suggested a topic. 🤨'
	: 'Thank you for your suggestions!'
	return content;
}

const getCollectedTopicsNotification = (id) => {
	return `${Formatters.userMention(id)} **Topic Suggestion Time has ended!**
Please use \`/wccc vote\` to create and start the voting.`;
}

export const topicTexts = {
	start: topicsStartMessageContent,
	onPrompt: getTopicPromptText,
	onEndCollecting: getCollectedTopicsText,
	onEndCollectingNotification: getCollectedTopicsNotification
}

///////////////////////////////////////////////////////////////////// config.js

/** @todo */
export const voteTexts = {

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

/////////////////////////////////////////////////////////////////////

export default {
	faqMessageContent,
	guideTitle,
	guideDescription,
	pastMessageContent,
};
