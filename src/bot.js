import {
	Client,
	Interaction
} from "discord.js";

import config from './config.js';
import commands from './functions/commands.js';
import presences from './commands/wccc/assets/presences.js';

import { getErrorReply } from './commands/wccc/assets/messages.js';
import { logger } from './functions/utils.js';

const client = new Client({ intents: config.intents });

/**
 * Ready Event
 * @param {Client} client
 */
const onReady = async (client) => {
	const presence = presences.getDefault(client);
	client.user.setPresence(presence);
};

/**
 * Interaction Event
 * @param {Client} client
 * @param {Interaction} interaction
 */
const onInteractionCreate = async (client, interaction) => {
	// @debug
	console.log(logger.red, `${logger.time()} ${interaction.user.tag} triggered an ${interaction.constructor.name}.`);

	if (interaction.isCommand()) {
		const { commandName } = interaction;
		const command = commands.get(commandName);

		if (!command) return;

		try {
			await command.execute(client, interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply(getErrorReply());
		}
	};
};

/**
 * Log errors
 */
process.on('unhandledRejection', console.error);

/**
 * Boot and Login
 */
(async () => {
	console.clear();

	// client.on('debug', console.warn);
	client.on('warn', console.warn);
	client.on('ready', onReady);
	client.on('interactionCreate', onInteractionCreate.bind(null, client));

	await client.login(config.BOT_TOKEN);

	console.log(logger.green, `${logger.time()} Bot logged in as ${client.user.tag}`);
})();