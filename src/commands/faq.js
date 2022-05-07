import { Constants, Client, Interaction, MessageEmbed } from 'discord.js';

const choices = {
	rules: {
		isMessage: true,
		content: 'Add rules message content.'
	},
	dontask: {
		isEmbed: true,
		description: `[Don't ask to ask](https://dontasktoask.com/)\nGive Information etc.`
	},
	code: {
		isMessage: true,
		content: getCodeFaqMessage(),
	}
};

export const data = {
	name: 'faq',
	description: 'Replies with answers to Frequently Asked Questions.',
	options: [
		{
			name: 'about',
			type: Constants.ApplicationCommandOptionTypes.STRING,
			description: 'Describe.',
			required: true,
			choices: Object.keys(choices).map((name) => {
				return {
					name,
					value: name
				};
			})
		},
	],
};

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
export const execute = async (client, interaction) => {
	const about = interaction.options.getString('about');
	const reply = {
		content: null,
		embeds: [],
		ephemeral: true,
	};

	if (choices[about].isMessage) {
		reply.content = choices[about].content;
	}
	else {
		const embed = new MessageEmbed();
		for (const [key, value] of Object.entries(choices[about])) {
			embed[key] = value;
		}
		reply.embeds.push(embed);
	}

	await interaction.reply(reply);
};

function getCodeFaqMessage() {
	let codeFaqMessage = '- Use a platform like <https://pastebin.com/> to share your code\n';
	codeFaqMessage += '- Surround your Code with three backticks.\n\n';
	codeFaqMessage += '\\`\\`\\`js\n\nlet foo = \'bar\';\n\n\\`\\`\\`\n';
	codeFaqMessage += 'will be converted into\n';
	codeFaqMessage += '```js\nlet foo = \'bar;\'\n```\n';
	codeFaqMessage += '- Or use single backticks for `inline` code.\n';

	return codeFaqMessage;
}