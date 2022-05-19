import config from '../config.js';

const getDefault = (client) => {
	const guild = client.guilds.cache.get(config.guildId);
	return {
		activities: [{ name: `${guild.memberCount} Users`, type: 'WATCHING' }],
		status: 'online'
	}
}

const getTopicTime = () => {
	return {
		activities: [{ name: `Topic Suggestion Time!`, type: 'PLAYING' }],
		status: 'online'
	}
}

const getVotingTime = () => {
	return {
		activities: [{ name: `Vote your #WCCChallenge topic!`, type: 'PLAYING' }],
		status: 'online'
	}
}

export default {
	getDefault,
	getTopicTime,
	getVotingTime,
}