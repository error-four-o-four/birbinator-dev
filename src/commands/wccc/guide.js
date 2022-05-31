import texts from './assets/messages.js';

export const description = `Shows some guidelines.`;

export default (client, interaction) => {
	const embed = {
		title: texts.guideTitle,
		description: texts.guideDescription,
	};
	interaction.reply({ embeds: [embed] });
};