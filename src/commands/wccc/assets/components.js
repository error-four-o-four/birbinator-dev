import { Constants } from 'discord.js';
// import { convertDuration } from '../../../handlers/utils.js';

import { customIds, labels } from './identifiers.js';

// import settings from '../controllers/settings.js';

export const components = {
	config: {
		// topic time
		[customIds.config[0]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.config[0],
			label: labels[customIds.config[0]],
			style: Constants.MessageButtonStyles.SECONDARY,
		},
		// topics max
		[customIds.config[1]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.config[1],
			label: labels[customIds.config[1]],
			style: Constants.MessageButtonStyles.SECONDARY,
		},
		// voting time
		[customIds.config[2]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.config[2],
			label: labels[customIds.config[2]],
			style: Constants.MessageButtonStyles.SECONDARY,
		},
	},
	select: {
		// select duration
		[customIds.select[0]]: {
			type: Constants.MessageComponentTypes.SELECT_MENU,
			custom_id: customIds.select[0],
			placeholder: labels[customIds.select[0]],
			max_values: 1,
			options: [],
		},
		// select amount
		[customIds.select[1]]: {
			type: Constants.MessageComponentTypes.SELECT_MENU,
			custom_id: customIds.select[1],
			placeholder: labels[customIds.select[1]],
			max_values: 1,
			options: [],
		},
	},
	prompt: {
		// exit
		[customIds.prompt[0]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.prompt[0],
			label: labels[customIds.prompt[0]],
			style: Constants.MessageButtonStyles.DANGER,
		},
		// back
		[customIds.prompt[1]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.prompt[1],
			label: labels[customIds.prompt[1]],
			style: Constants.MessageButtonStyles.DANGER,
		},
		// cancel
		[customIds.prompt[2]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.prompt[2],
			label: labels[customIds.prompt[2]],
			style: Constants.MessageButtonStyles.DANGER,
		},
		// confirm
		[customIds.prompt[3]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.prompt[3],
			label: labels[customIds.prompt[3]],
			style: Constants.MessageButtonStyles.SUCCESS,
		},
	}
};

// export const getSettingsMainComponents = () => {
// 	return [{
// 		type: Constants.MessageComponentTypes.ACTION_ROW,
// 		components: [
// 			components.prompt[customIds.prompt[0]], // Exit
// 			components.config[customIds.config[0]],
// 			components.config[customIds.config[1]],
// 			components.config[customIds.config[2]],
// 		],
// 	}];
// };

// export const getSettingsEditingCompnents = (customId) => {
// 	const getAmountOptions = () => settings.amounts.map((amount) => {
// 		return {
// 			value: '' + amount,
// 			label: amount + ' topics',
// 		};
// 	})
// 	const getDurationOptions = () => settings.durations.map((millis) => {
// 		return {
// 			value: '' + millis,
// 			label: convertDuration(millis),
// 		};
// 	})
// 	const component = (customId === customIds.config[1])
// 		? components.config[customIds.config[1]]
// 		: components.config[customIds.config[0]];

// 	component.options = (customId === customIds.config[1])
// 		? getAmountOptions()
// 		: getDurationOptions();

// 	return [
// 		{
// 			type: Constants.MessageComponentTypes.ACTION_ROW,
// 			components: [
// 				component,
// 			],
// 		},
// 		{
// 			type: Constants.MessageComponentTypes.ACTION_ROW,
// 			components: [
// 				components.prompt[customIds.prompt[1]], // Back
// 				components.prompt[customIds.prompt[3]], // Confirm
// 			],
// 		},
// 	];
// };

/////////////////////////////////////////////////////////////////////////////

export const getPromptComponents = () => {
	return [{
		type: Constants.MessageComponentTypes.ACTION_ROW,
		components: [
			components.prompt[customIds.prompt[2]], // Cancel
			components.prompt[customIds.prompt[3]], // Confirm
		],
	}];
};