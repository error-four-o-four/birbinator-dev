// Identifiers
import { customIds, labels } from './assets/identifiers.js';

// Controllers
import voting from './controllers/voting.js';
import settings from './controllers/settings.js';

// Utils
import { getEphemeralReply, getEmbed } from './assets/messages.js';
import { convertDuration, createClickCollector } from '../../functions/utils.js';

export const description = `Configurates settings.`;

export default async (client, interaction) => {
	// guard cause
	if (voting.state) {
		const content = `**A vote is currently taking place.**\rEither end it manually with \`/wccc stop\` or wait until the time is over. It\'ll end in ${convertDuration(~~((voting.timestamp.getTime() - Date.now()) / 1000) * 1000)}.`;
		const reply = getEphemeralReply(content);
		await interaction.reply(reply);
		return;
	}

	const clickCollector = createClickCollector(interaction);

	const embed = getEmbed(client, {
		title: '**These are your #WCCChallenge settings.**',
		description: settings.getMainDescription(),
	});

	const components = settings.getMainComponents();

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

		settings.reset();
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

const handleButton = async (interaction, collector, embed) => {
	const { customId } = interaction;
	let components;

	// Clicked 'exit' - emit end of interaction
	if (customId === customIds.prompt[0]) {
		settings.reset();
		collector.stop('ended');
		return;
	}

	// Clicked 'back' - return to config menu
	if (customId === customIds.prompt[1]) {
		settings.reset();
		embed.description = settings.getMainDescription();
		components = settings.getMainComponents();
	}

	// Clicked Submit
	if (customId === customIds.prompt[3]) {
		if (!settings.getSelection()) {
			embed.description = ':warning: No value selected!';
			components = settings.getValueComponents(customId);
		}
		else {
			settings.submit();
			settings.reset();
			embed.title = 'These are your WCCC Settings';
			embed.description = settings.getMainDescription();
			components = settings.getMainComponents();
		}
	}

	// Clicked config button - display editing menu
	if (customIds.config.includes(customId)) {
		settings.select(customId);
		embed.title = labels[customId];
		embed.description = 'Please choose a value from the menu.';
		components = settings.getValueComponents(customId);
	}

	await interaction.editReply({
		embeds: [embed],
		components: components,
		ephemeral: true
	});
	collector.resetTimer();
};

const handleSelection = async (interaction, collector) => {
	settings.setSelection(interaction.customId, interaction.values[0]);
	collector.resetTimer();
};