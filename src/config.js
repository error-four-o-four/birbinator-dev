import {config} from 'dotenv';
config();

// ### SECRETS
export const BOT_TOKEN = process.env.BOT_TOKEN;

// ### BOT CONFIG
export const botId = '969310807076790312';
export const guildId = process.env.GUILD_ID;

export const roleIds = {
	moderator: '977873249440526376',
	notification: '974624963682263050',
}

export const channelIds = {
	chat: '963542829685158018',
	submissions: '896810496618020905',
	voting: '969317896432009216',
}

// ### intents calculator https://ziad87.net/intents/
// intents: [
// 	Intents.FLAGS.GUILDS,
// 	Intents.FLAGS.GUILD_MEMBERS,
// 	Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
// 	Intents.FLAGS.GUILD_PRESENCES,
// 	Intents.FLAGS.GUILD_MESSAGES,
// 	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
// 	Intents.FLAGS.DIRECT_MESSAGES,
// 	Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
// 	Intents.FLAGS.MESSAGE_CONTENT,
// ]
export const intents = 46859;

export const notion = {
	dbId: '715cb2bf2c89445a83a836063bf2144c',
	dbKey: process.env.NOTION_DB_TOKEN,
	keys: [
		'topic',
		'emoji',
		'notes',
		'stream_date',
		'suggested_by',
		'suggested_topics',
	],
	ids: [
		'title',
		'%5Es_g',
		'EKSm',
		'%3DaeV',
		'Ez%3D%40',
		'soBr',
	]
}

export default {
	BOT_TOKEN,
	botId,
	guildId,
	roleIds,
	channelIds,
	intents,
	notion,
}
