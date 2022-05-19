import { Client, Interaction } from 'discord.js';
import texts from './assets/messages.js';

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default (client, interaction) => {
	const embed = {
		title: texts.guideTitle,
		description: texts.guideDescription,
	};
	interaction.reply({ embeds: [embed] });
};