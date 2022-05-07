import customIds from './identifiers.js';

export default {
	[customIds.config[0]]: 1000 * 60, // millis
	// [customIds.config[0]]: 1000 * 60 * 10, // millis / default: 10 minutes
	[customIds.config[1]]: 5,
	[customIds.config[2]]: 1000 * 60,
	values: {
		amounts: [
			2, 5, 10, 20
		],
		durations: [
			60, 300, 600, 1800, 3600, 7200, 43200, 86400 // seconds
		].map((v) => v *= 1000), // millis
	},
	selection: {
		customId: undefined,
		type: undefined,
		value: undefined,
	},
	resetSelection() {
		for (const key of ['customId', 'type', 'value']) this.selection[key] = undefined;
	},
	submitSelection() {
		const {customId, value} = this.selection;
		this[customId] = parseInt(value);
	}
};