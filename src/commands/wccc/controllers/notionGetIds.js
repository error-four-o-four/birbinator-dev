import { notion as config } from '../../../config.js';
import { Client } from '@notionhq/client';

// testing
// https://flossy-desk-513.notion.site/715cb2bf2c89445a83a836063bf2144c?v=b20e1cba537a407eae7362d6505bc55f

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