import { notion as config } from '../../../config.js';
import { Client } from '@notionhq/client';

const notion = new Client({
	auth: config.dbKey
});

const getDbIds = async () => {
	const response = await notion.databases.retrieve({
		database_id: config.dbId
	})
	console.log(response);
}

getDbIds();

// testing
// https://flossy-desk-513.notion.site/715cb2bf2c89445a83a836063bf2144c?v=b20e1cba537a407eae7362d6505bc55f

// import { createNotionPage } from './notion.js';

// createNotionPage({
// 	// winner
// 	from: {
// 		id: '790552703058837514',
// 		bot: false,
// 		system: false,
// 		flags: [],
// 		username: 'error-four-o-four',
// 		discriminator: '7727',
// 		avatar: 'ec7dbe154a2812b3db4df5d3e9605d2c',
// 		banner: undefined,
// 		accentColor: undefined
// 	},
// 	content: 'one',
// 	hasEmoji: false,
// 	emoji: '🎈',
// 	votes: 1,
// }, [
// 	// topics
// 	{
// 		from: {
// 			id: '790552703058837514',
// 			bot: false,
// 			system: false,
// 			flags: [],
// 			username: 'error-four-o-four',
// 			discriminator: '7727',
// 			avatar: 'ec7dbe154a2812b3db4df5d3e9605d2c',
// 			banner: undefined,
// 			accentColor: undefined
// 		},
// 		content: 'one',
// 		hasEmoji: false,
// 		emoji: '🎆',
// 		votes: 0,
// 	},
// 	{
// 		from: {
// 			id: '790552703058837514',
// 			bot: false,
// 			system: false,
// 			flags: [],
// 			username: 'error-four-o-four',
// 			discriminator: '7727',
// 			avatar: 'ec7dbe154a2812b3db4df5d3e9605d2c',
// 			banner: undefined,
// 			accentColor: undefined
// 		},
// 		content: 'two',
// 		hasEmoji: false,
// 		emoji: '🎇',
// 		votes: 0,
// 	},
// ]);