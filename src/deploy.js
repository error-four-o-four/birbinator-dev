import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import {
	botId,
	guildId,
	BOT_TOKEN
} from './config.js';

import { logger } from './functions/utils.js';
import commands from './functions/commands.js';

const data = commands.map((cmd) => cmd.data);
const rest = new REST({ version: '9' }).setToken(BOT_TOKEN);

(async () => {
	try {
		console.log(logger.magenta, `${logger.time()} Attempting to deploy ${data.length} commands.`);
		console.log(data);

		await rest.put(
			Routes.applicationGuildCommands(botId, guildId),
			{ body: data },
		);

		console.log(logger.blue, 'Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
