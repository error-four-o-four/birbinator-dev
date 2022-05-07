import { Client, Interaction } from 'discord.js';
import texts from './assets/texts.js';
/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default (client, interaction) => {
		interaction.reply({
			content: texts.pastMessageContent,
		});
};