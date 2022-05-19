import {
	Client,
	Interaction
} from "discord.js";

import config from './config.js';
import commands from './handlers/commands.js';
import presences from './handlers/presences.js';
import { logger } from './handlers/utils.js';

const client = new Client({ intents: config.intents });

/**
 * Ready Event
 * @param {Client} client
 */
const onReady = async (client) => {
	// const guild = client.guilds.cache.get(config.guildId);
	// const manager = (guild) ? guild.commands : client.application?.commands;

	// clear cache - necessary?
	// manager?.cache?.clear();
	// await manager.fetch().then((collection) => collection.forEach(({ id }) => manager?.delete(id)));

	// for (const command of commands.values()) {
	// 	manager?.create(command.data);
	// }

	// @debug
	// const logs = await commands.fetch().then(res => JSON.parse(JSON.stringify(res)))
	// logs.forEach(cmd => console.log(cmd.id, cmd.options));
	// console.log(`${commands.size} ${(commands.size === 1) ? 'command' : 'commands'} loaded`);

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
		const { commandName, options } = interaction;
		const command = commands.get(commandName);

		if (!command) return;

		try {
			await command.execute(client, interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
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

	client.on('warn', console.warn);
	// client.on('debug', console.warn);
	client.on('ready', onReady);
	client.on('interactionCreate', onInteractionCreate.bind(null, client));

	await client.login(config.BOT_TOKEN);

	console.log(logger.green, `${logger.time()} Bot logged in as ${client.user.tag}`);
})();