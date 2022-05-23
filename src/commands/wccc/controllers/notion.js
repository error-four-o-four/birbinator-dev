import { notion as config } from '../../../config.js';
import { Client } from '@notionhq/client';

// testing
// https://flossy-desk-513.notion.site/715cb2bf2c89445a83a836063bf2144c?v=b20e1cba537a407eae7362d6505bc55f

const notion = new Client({
	auth: config.dbKey
});

// async const getDbIds = () => {
// 	const response = await notion.databases.retrieve({
// 		database_id: config.dbId
// 	})
// 	console.log(response);
// }

// getDbIds();

const createProperty = (content, title = false) => {
	const item = {
		type: 'text',
		text: {
			content: content,
		}
	};
	return (title) ? { title: [item] } : { rich_text: [item] };
};

const createProperties = (data) => {
	return Object.entries(data).reduce((result, [key, value]) => {
	// return Object.entries(data).filter(([key, _]) => key !== 'stream_date').reduce((result, [key, value]) => {
		// console.log(key, value);
		result[config.ids[key]] = createProperty(value, key === 'topic');
		return result;
	}, {});
};

const createDateProperty = () => {
	const date = new Date();
	date.setUTCDate(date.getUTCDate() + (7 - date.getUTCDay()));
	date.setUTCHours(15, 0, 0, 0);

	return {
		[config.ids.stream_date]: {
			date: {
				start: date.toISOString(),
			}
		}
	};
};

/**
 *
 * @param {Object} data
 * @param {string} data.topic
 * @param {string} data.emoji
 * @param {string} data.notes
 * @param {string} data.suggested_by
 * @param {string} data.suggested_topics
 */
export const createNotionPage = (data) => {
	const parent = {
		database_id: config.dbId
	};
	const properties = {
		...createProperties(data),
		...createDateProperty(),
	};

	// console.log(properties);

	notion.pages.create({
		parent,
		properties,
	});
}

// createNotionPage({
// 	topic: 'Test Topic',
// 	notes: 'Just a note',
// 	emoji: '🎈',
// 	suggested_by: 'someone',
// 	suggested_topics: 'test, another, morp',
// });