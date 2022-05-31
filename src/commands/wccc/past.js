import texts from './assets/messages.js';

export const description = `Sends a link to the past topics.`;

export default (client, interaction) => {
		interaction.reply({
			content: texts.pastMessageContent,
		});
};