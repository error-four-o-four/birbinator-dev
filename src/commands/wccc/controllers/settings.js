import { Constants } from 'discord.js';
import { convertDuration } from '../../../handlers/utils.js';
import { customIds, labels } from '../assets/identifiers.js';
import { components } from '../assets/components.js';

// the #wccc settings
const values = {
	[customIds.config[0]]: 1000 * 60,
	// [customIds.config[0]]: 1000 * 60 * 10, // millis / default: 10 minutes
	[customIds.config[1]]: 5,
	[customIds.config[2]]: 1000 * 60,
	amounts: [
		2, 5, 10, 20
	],
	durations: [
		60, 300, 600, 1800, 3600, 7200, 43200, 86400
	].map((v) => v *= 1000), // convert sec to ms
	timeouts: [
		120, 300, // delta!
	],
};

// keep track of the selected values -> /wccc settings
const current = {
	customId: undefined,
	type: undefined,
	value: undefined,
};
const select = (customId) => {
	current.customId = customId;
};
const getSelection = () => {
	return current.value;
};
const setSelection = (customId, value) => {
	current.type = customId;
	current.value = parseInt(value);
};
const reset = () => {
	for (const key in current) {
		current[key] = undefined;
	}
};
const submit = () => {
	const { customId, value } = current;
	values[customId] = parseInt(value);
};

const getValue = (customId) => {
	return values[customId];
}

const getMainDescription = () => {
	return customIds.config.reduce((result, customId, i) => {
		return result += `${labels[customId]}: ${(i === 1) ? values[customId] : convertDuration(values[customId])}\n`;
	}, 'What do you want do change?\n\n');
};

const getMainComponents = () => {
	return [{
		type: Constants.MessageComponentTypes.ACTION_ROW,
		components: [
			components.prompt[customIds.prompt[0]], // Exit
			components.config[customIds.config[0]],
			components.config[customIds.config[1]],
			components.config[customIds.config[2]],
		],
	}];
};

// const getValueDescription = () => {
// 	return `Please choose a value from the menu.`;
// };

const getValueComponents = (customId) => {
	const getAmountOptions = () => settings.amounts.map((amount) => {
		return {
			value: '' + amount,
			label: amount + ' topics',
		};
	});
	const getDurationOptions = () => settings.durations.map((millis) => {
		return {
			value: '' + millis,
			label: convertDuration(millis),
		};
	});
	const component = (customId === customIds.config[1])
		? components.config[customIds.config[1]]
		: components.config[customIds.config[0]];

	component.options = (customId === customIds.config[1])
		? getAmountOptions()
		: getDurationOptions();

	return [
		{
			type: Constants.MessageComponentTypes.ACTION_ROW,
			components: [
				component,
			],
		},
		{
			type: Constants.MessageComponentTypes.ACTION_ROW,
			components: [
				components.prompt[customIds.prompt[1]], // Back
				components.prompt[customIds.prompt[3]], // Confirm
			],
		},
	];
};

export default {
	select,
	getSelection,
	setSelection,
	reset,
	submit,

	getValue,

	getMainDescription,
	getMainComponents,
	// getValueDescription,
	getValueComponents
};