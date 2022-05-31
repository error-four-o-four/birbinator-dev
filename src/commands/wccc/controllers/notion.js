import { notion as config } from '../../../config.js';
import { Client } from '@notionhq/client';
import { User } from 'discord.js';

// testing
// https://flossy-desk-513.notion.site/715cb2bf2c89445a83a836063bf2144c?v=b20e1cba537a407eae7362d6505bc55f

const notion = new Client({
	auth: config.dbKey
});

const createProperty = (content, title = false) => {
	const item = {
		type: 'text',
		text: {
			content: content,
		}
	};
	// return either a title or a rich_text property
	return (title) ? { title: [item] } : { rich_text: [item] };
};

const createDateProperty = () => {
	const date = new Date();
	date.setUTCDate(date.getUTCDate() + (7 - date.getUTCDay()));
	date.setUTCHours(15, 0, 0, 0);

	return {
		[config.ids[3]]: {
			date: {
				start: date.toISOString(),
			}
		}
	};
};

const createProperties = (data) => {
	return Object.entries(data).reduce((result, [key, value]) => {
		const id = config.ids[config.keys.indexOf(key)];
		result[id] = createProperty(value, key === 'topic');
		return result;
	}, {});
};

/**
 *
 * @param {Object} winner
 * @param {string} winner.content
 * @param {string} winner.emoji
 * @param {User}	winner.from
 * @param {array} topics
 */
export const createNotionPage = (winner, topics) => {
	const data = {
		// topic
		[config.keys[0]]: winner.content,
		// emoji
		[config.keys[1]]: winner.emoji,
		// suggested by
		[config.keys[4]]: winner.from.username,
		// suggested
		[config.keys[5]]: topics.map((t) => `${t.content} (${t.votes})`).join(', '),
	};
	const parent = {
		database_id: config.dbId
	};
	const properties = {
		...createProperties(data),
		...createDateProperty(),
	};

	notion.pages.create({
		parent,
		properties,
	});
};

createNotionPage({
	from: {
		id: '790552703058837514',
		bot: false,
		system: false,
		flags: [],
		username: 'error-four-o-four',
		discriminator: '7727',
		avatar: 'ec7dbe154a2812b3db4df5d3e9605d2c',
		banner: undefined,
		accentColor: undefined
	},
	content: 'one',
	hasEmoji: false,
	emoji: '🎈',
	votes: 0,
}, [
	{
		from: {
			id: '790552703058837514',
			bot: false,
			system: false,
			flags: [],
			username: 'error-four-o-four',
			discriminator: '7727',
			avatar: 'ec7dbe154a2812b3db4df5d3e9605d2c',
			banner: undefined,
			accentColor: undefined
		},
		content: 'one',
		hasEmoji: false,
		emoji: '🎆',
		votes: 0,
	},
	{
		from: {
			id: '790552703058837514',
			bot: false,
			system: false,
			flags: [],
			username: 'error-four-o-four',
			discriminator: '7727',
			avatar: 'ec7dbe154a2812b3db4df5d3e9605d2c',
			banner: undefined,
			accentColor: undefined
		},
		content: 'two',
		hasEmoji: false,
		emoji: '🎇',
		votes: 0,
	},
]);