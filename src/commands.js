import fs from 'fs';
import { Collection } from 'discord.js';

// read directory content
const getFiles = async (path) => {
	const url = new URL(path, import.meta.url);
	return fs.readdirSync(url).filter((file) => file.endsWith('.js'));
};

// import files and store them in a collection
const createCommands = async (path) => {
	const commands = new Collection();
	const files = await getFiles(path);

	for (const file of files) {
		const command = await import(`${path}${file}`);
		commands.set(command.data.name, command);
	}
	return commands;
};

export default await createCommands('./commands/');


