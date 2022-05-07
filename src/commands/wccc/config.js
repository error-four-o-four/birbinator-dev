import { ButtonInteraction, Client, Interaction, InteractionCollector } from 'discord.js';
import { getDefaultEmbed, getDefaultComponents, getEditingComponents, getOnExitReply } from './assets/elements.js';
import customIds from './assets/identifiers.js';
import settings from './assets/settings.js';
import { getDefaultContent, getEditingContent } from './assets/texts.js';
import { createClickCollector } from './assets/utils.js';

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default async (client, interaction) => {
	const clickCollector = createClickCollector(interaction);

	let embed = { ...getDefaultEmbed(client), ...getDefaultContent(settings) };
	let components = getDefaultComponents();

	await interaction.reply({
		embeds: [embed],
		components: components,
		ephemeral: true
	});

	// collect interactions
	clickCollector.on('collect', async (clickInteraction) => {
		if (!clickInteraction) return;
		/** @todo?? add guard clause: !customIds.inlucdes(btnInteraction.customId) */

		await clickInteraction.deferUpdate();

		// listen for button interactions
		if (clickInteraction.isButton()) {
			await handleButton(clickInteraction, clickCollector, embed, components);
			return;
		}

		// listen for select menu interactions
		if (clickInteraction.isSelectMenu()) {
			await handleSelection(clickInteraction, clickCollector);
			return;
		}
	});

	clickCollector.on('end', async (collected, reason) => {
		settings.resetSelection();
		if (reason === 'time' || reason === 'ended') {
			interaction.editReply(getOnExitReply(reason));
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
 * @param {array} components
 */
const handleButton = async (interaction, collector, embed, components) => {
	const { customId } = interaction;

	// Clicked 'exit' - emit end of interaction
	if (customId === customIds.prompt[0]) {
		settings.resetSelection();
		collector.stop('ended');
		return;
	}

	// Clicked 'back' - return to config menu
	if (customId === customIds.prompt[1]) {
		settings.resetSelection();
		embed = { ...embed, ...getDefaultContent(settings) };
		components = getDefaultComponents();
	}

	// Clicked Submit
	if (customId === customIds.prompt[3]) {
		if (!settings.selection.value) {
			embed.description = ':warning: No value selected!';
			components = getEditingComponents(customId);
		}
		else {
			settings.submitSelection();
			settings.resetSelection();
			embed = { ...embed, ...getDefaultContent(settings) };
			components = getDefaultComponents();
		}
	}

	// Clicked config button - display editing menu
	if (customIds.config.slice(0, 3).includes(customId)) {
		settings.selection.customId = customId;
		embed = { ...embed, ...getEditingContent(customId) };
		components = getEditingComponents(customId);
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
	settings.selection.type = interaction.customId;
	settings.selection.value = parseInt(interaction.values[0]);
	collector.resetTimer();
};