import { Constants, ButtonInteraction, Interaction, InteractionCollector, MessageCollector } from 'discord.js';

/**
 * Convert string <1min> to milliseconds
 * @param {string} t
 * @returns {number}
 */
export const convertMs = (t)=>t.match(/(\d+)\s*(\w)/)?.reduce((r,s,i)=>r*[1,s,{s:1000,m:60000,h:3600000}[s?.toLowerCase()]][i],1)??NaN

// const convertTimeToMs = (string) => {
// 	if (!string) return null;
// 	const { number, unit } = string.trim().replaceAll(/ +/g, '').split('').reduce((result, current) => {
// 		const isLetter = isNaN(parseInt(current));
// 		if (!isLetter) {
// 			result.digits++;
// 			result.number += current;
// 		}
// 		if (!result.unit && isLetter) {
// 			result.unit = current.toLowerCase();
// 			result.number = parseInt(result.number);
// 		}
// 		return result;
// 	},
// 		{ digits: 0, number: '', unit: undefined });
// 	return (unit.startsWith('s')) ? number * 1000 : (unit.startsWith('m')) ? number * 1000 * 60 : (unit.startsWith('h')) ? number * 1000 * 60 * 60 : NaN;
// };

/**
 * Convert milliseconds to h:m:s
 * @param {string|number} t
 * @returns {string}
 */
export const convertDuration = (t) => {
	const getPlural = (v) => (v !== 1) ? 's' : '';
	let h, m, s;
	t = parseInt(t) / 1000;
	h = Math.trunc(t / 3600);
	m = Math.trunc(t % 3600 / 60);
	s = Math.trunc(t % 60);
	return `${(h) ? h + ' hour' + getPlural(h) : ''} ${(m) ? m + ' minute' + getPlural(m) : ''} ${(s) ? s + ' second' + getPlural(s) : ''}`;
};
/**
 *
 * @param {ButtonInteraction} interaction
 * @param {number} time
 * @param {number} max
 * @returns {InteractionCollector}
 */
export const createClickCollector = (interaction, time = 20000, max = 50) => {
	return interaction.channel.createMessageComponentCollector({
		filter: (btnInteraction) => interaction.user.id === btnInteraction.user.id,
		time,
		max,
	});
};
/**
 *
 * @param {Interaction} interaction
 * @param {number} time
 * @param {number} max
 * @returns {MessageCollector}
 */
export const createTopicCollector = (interaction, time = 20000) => {
	return interaction.channel.createMessageCollector({
		filter: (msg) => msg.content.startsWith('topic'),
		time,
	});
}

export const validateTopic = (content) => {
	content = content.trim().replace(/\s\s+/g, ' ').replace(/\r?\n/g, ' ');
	return content.split(' ').splice(1).join(' ');
}

export const createPromptCollector = (message) => {
	return message.channel.createMessageComponentCollector({
		componentType: Constants.MessageComponentTypes.BUTTON,
		filter: (btnInteraction) => btnInteraction.user.id === message.author.id,
		time: 1000 * 5,
		max: 1
	});
}