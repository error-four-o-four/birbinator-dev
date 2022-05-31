import { Collection } from 'discord.js';
import { getFiles } from './utils.js';

// import files and store them in a collection
const createCommands = async (path) => {
	const url = new URL(path, import.meta.url);
	const commands = new Collection();
	const files = await getFiles(url);

	for (const file of files) {
		const command = await import(`${url}${file}`);
		commands.set(command.data.name, command);
	}
	return commands;
};

export default await createCommands('../commands/');