import { ButtonInteraction, Constants, InteractionCollector, Message } from 'discord.js';


// https://gist.github.com/abritinthebay/d80eb99b2726c83feb0d97eab95206c4
export const logger = {
	red: '\x1b[31m%s\x1b[0m',
	green: '\x1b[32m%s\x1b[0m',
	yellow: '\x1b[33m%s\x1b[0m',
	blue: '\x1b[34m%s\x1b[0m',
	magenta: '\x1b[35m%s\x1b[0m',
	cyan: '\x1b[36m%s\x1b[0m',
	white: '\x1b[37m%s\x1b[0m',
	time: () => {
		const d = new Date();
		return `[${d.toTimeString().slice(0, 8)}]`;
		// return `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`;
	},
};


/**
 * Convert string <1min> to milliseconds. Ty @nking :D
 * @param {string} t
 * @returns {number} ms
 */
export const convertMs = (t) => t.match(/(\d+)\s*(\w)/)?.reduce((r, s, i) => r * [1, s, { s: 1000, m: 60000, h: 3600000 }[s?.toLowerCase()]][i], 1) ?? NaN;

/**
 * Convert milliseconds to h:m:s
 * @param {string|number} t
 * @returns {string} h:m:s
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
 * @returns {InteractionCollector} Collector
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
 * @param {Message} message
 * @returns {InteractionCollector} Collector
 */
export const createPromptCollector = (message, time = 5000, max = 1) => {
	/** @todo isDMChannel ?  */
	return message.channel.createMessageComponentCollector({
		componentType: Constants.MessageComponentTypes.BUTTON,
		filter: (btnInteraction) => btnInteraction.user.id === message.author.id,
		time,
		max
	});
};