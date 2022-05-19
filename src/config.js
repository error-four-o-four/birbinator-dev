import {config} from 'dotenv';
config();

// ### SECRETS
export const BOT_TOKEN = process.env.BOT_TOKEN;

// ### BOT CONFIG
export const botId = process.env.BOT_ID;
export const guildId = process.env.GUILD_ID;
export const notifyId = process.env.NOTIFY_ID;

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

export const owners = [
	{
		id: process.env.OWNER_ID,
	}
]

export default {
	BOT_TOKEN,
	botId,
	guildId,
	notifyId,
	owners,
	intents,
}
