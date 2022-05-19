import {
	ButtonInteraction,
	Client,
	Interaction,
	InteractionCollector
} from 'discord.js';

import controller from './assets/controller.js';
import customIds from './assets/identifiers.js';

import getElement from './assets/elements.js';

import getComponents from './assets/components.js';
import { settings as getMessage } from './assets/messages.js';

import { createClickCollector, convertDuration } from '../../handlers/utils.js';

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default async (client, interaction) => {
	const clickCollector = createClickCollector(interaction);

	const embed = getElement.embeds.settings.main(client);
	const components = getComponents.settings.main();

	await interaction.reply({
		embeds: [embed],
		ephemeral: true,
		components,
	});

	// collect interactions
	clickCollector.on('collect', async (clickInteraction) => {
		if (!clickInteraction) return;
		/** @todo?? add guard cause: !customIds.inlucdes(btnInteraction.customId) */

		await clickInteraction.deferUpdate();

		// listen for button interactions
		if (clickInteraction.isButton()) {
			await handleButton(clickInteraction, clickCollector, embed);
			return;
		}

		// listen for select menu interactions
		if (clickInteraction.isSelectMenu()) {
			await handleSelection(clickInteraction, clickCollector);
			return;
		}
	});

	clickCollector.on('end', async (collected, reason) => {
		const message = `Ended settings configuration. ${(reason === 'time') ? 'Time has expired.' : 'By User.'}`;

		controller.resetSelection();
		if (reason === 'time' || reason === 'ended') {
			interaction.editReply({
				content: message,
				embeds: [],
				components: [],
			});
			return;
		}
		/** @todo else? */
	});
};

/**
 *
 * @param {ButtonInteraction} interaction
 * @param {InteractionCollector} collector
 * @param {object} embed
 */
const handleButton = async (interaction, collector, embed) => {
	const { customId } = interaction;
	let components;

	// Clicked 'exit' - emit end of interaction
	if (customId === customIds.prompt[0]) {
		controller.resetSelection();
		collector.stop('ended');
		return;
	}

	// Clicked 'back' - return to config menu
	if (customId === customIds.prompt[1]) {
		controller.resetSelection();
		// embed.title = 'These are your WCCC Settings';
		embed.description = controller.settingsDescription;
		// embed = { ...embed, ...getMessage.main(controller.settings) };
		components = getComponents.main();
	}

	// Clicked Submit
	if (customId === customIds.prompt[3]) {
		if (!controller.getSelectionValue()) {
			embed.description = ':warning: No value selected!';
			components = getComponents.edit(customId);
		}
		else {
			controller.submitSelection();
			controller.resetSelection();
			// embed.title = 'These are your WCCC Settings';
			embed.description = controller.settingsDescription;
			// embed = { ...embed, ...getMessage.main(controller.settings) };
			components = getComponents.main();
		}
	}

	// Clicked config button - display editing menu
	if (customIds.config.slice(0, 3).includes(customId)) {
		controller.setSelectionId(customId);
		embed.description = controller.settingsDescriptionValue;
		components = getComponents.edit(customId);
	}

	await interaction.editReply({
		embeds: [embed],
		components: components,
		ephemeral: true
	});
	collector.resetTimer();
};

/**
 *
 * @param {ButtonInteraction} interaction
 * @param {InteractionCollector} collector
 * @param {object} embed
 * @param {array} components
 */
const handleSelection = async (interaction, collector) => {
	controller.setSelectionValue(interaction);
	collector.resetTimer();
};