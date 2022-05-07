import fetch from 'node-fetch';
import { MessageEmbed, Constants } from 'discord.js';

let size = 3;

const base = 'https://developer.mozilla.org';
const uri = `${base}/api/v1/search?locale=en-US&size=${size}&q=`;

const name = 'mdn';
const description = `Retrieve the first ${size} entries from a MDN Documentation Search.`;
const options = [
	{
		name: 'search-query',
		type: Constants.ApplicationCommandOptionTypes.STRING,
		description: 'Enter a search query string.',
		required: true,
	}
];

/**
 * Slash command data
 */
export const data = {
	name,
	description,
	options
};

/**
 * Slash command callback
 * @param {Client} client
 * @param {Interaction} interaction
 */
export const execute = async (client, interaction) => {
	const query = interaction.options.getString('search-query');
	const reply = {};

	await interaction.reply({ content: 'Fetching...', fetchReply: true });

	// @debug
	// console.log('command mdn.js \n', query, interaction.options.data, interaction.options.resolved);

	try {
		const { documents, metadata } = await fetch(`${uri}${query}`).then((res) => res.json());

		// Error handling
		const errorMsg = (!documents)
		? 'Not able to reach MDN.'
		: (documents.length === 0)
			? `No results found for "${query}".`
			: null;
		if (errorMsg) {
			reply.content = errorMsg;
			reply.ephemeral = true;
		}
		// Reply handling
		else {
			const total = metadata.total.value;

			const embed = new MessageEmbed()
				.setAuthor({
					name: `MDN Documentation`,
					iconURL: 'https://avatars.githubusercontent.com/u/7565578?s=200&v=4',
				});

			for (let { mdn_url, title, summary } of documents.splice(0, 3)) {
				summary = summary.replace(/(\r\n|\n|\r)/gm, '');
				embed.addField(title, `${summary} [Visit](${base}${mdn_url})`);
			}

			reply.content = `Fetched ${total - size} results including '${query}'. [See all results ...](${base}/en-US/search?q=${query})`;
			reply.embeds = [embed];
		}
		interaction.editReply(reply);

	} catch (error) {
		console.log(error);
	}
};