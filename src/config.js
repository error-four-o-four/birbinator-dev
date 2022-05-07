import {config} from 'dotenv';
config();

// ### SECRETS
export const BOT_TOKEN = process.env.BOT_TOKEN;

// ### BOT CONFIG
export const botId = '969310807076790312';
export const guildId = '963539787019599953';
export const channelId = '969317896432009216';

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
		id: '790552703058837514',
		discriminator: '7727',
	}
]

export default {
	BOT_TOKEN,
	botId,
	guildId,
	channelId,
	owners,
	intents,
}
