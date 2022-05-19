import { Constants } from 'discord.js';
import { convertDuration } from '../../../handlers/utils.js';

import controller from './controller.js';
import customIds from './identifiers.js';

const components = {
	config: {
		// topic time
		[customIds.config[0]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.config[0],
			label: controller.labels[customIds.config[0]],
			style: Constants.MessageButtonStyles.SECONDARY,
		},
		// topics max
		[customIds.config[1]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.config[1],
			label: controller.labels[customIds.config[1]],
			style: Constants.MessageButtonStyles.SECONDARY,
		},
		// voting time
		[customIds.config[2]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.config[2],
			label: controller.labels[customIds.config[2]],
			style: Constants.MessageButtonStyles.SECONDARY,
		},
		// select duration
		[customIds.config[3]]: {
			type: Constants.MessageComponentTypes.SELECT_MENU,
			custom_id: customIds.config[3],
			placeholder: controller.labels[customIds.config[3]],
			max_values: 1,
			options: [],
		},
		// select amount
		[customIds.config[4]]: {
			type: Constants.MessageComponentTypes.SELECT_MENU,
			custom_id: customIds.config[4],
			placeholder: controller.labels[customIds.config[4]],
			max_values: 1,
			options: [],
		},
	},
	prompt: {
		// exit
		[customIds.prompt[0]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.prompt[0],
			label: controller.labels[customIds.prompt[0]],
			style: Constants.MessageButtonStyles.DANGER,
		},
		// back
		[customIds.prompt[1]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.prompt[1],
			label: controller.labels[customIds.prompt[1]],
			style: Constants.MessageButtonStyles.DANGER,
		},
		// cancel
		[customIds.prompt[2]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.prompt[2],
			label: controller.labels[customIds.prompt[2]],
			style: Constants.MessageButtonStyles.DANGER,
		},
		// confirm
		[customIds.prompt[3]]: {
			type: Constants.MessageComponentTypes.BUTTON,
			custom_id: customIds.prompt[3],
			label: controller.labels[customIds.prompt[3]],
			style: Constants.MessageButtonStyles.SUCCESS,
		},
	}
};


const getSettingsMain = () => {
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

const getSettingsEditing = (customId) => {
	/** @todo */
	const component = (customId === customIds.config[1])
		? components.config[customIds.config[4]]
		: components.config[customIds.config[3]];

	component.options = (customId === customIds.config[1])
		? controller.settings.amounts.map((amount) => {
			return {
				value: '' + amount,
				label: amount + ' topics',
			};
		})
		: controller.settings.durations.map((millis) => {
			return {
				value: '' + millis,
				label: convertDuration(millis),
			};
		});

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

const settings = {
	main: getSettingsMain,
	edit: getSettingsEditing,
}

/////////////////////////////////////////////////////////////////////////////

export const getPrompt = () => {
	return [{
		type: Constants.MessageComponentTypes.ACTION_ROW,
		components: [
			components.prompt[customIds.prompt[2]], // Cancel
			components.prompt[customIds.prompt[3]], // Confirm
		],
	}];
};

export default {
	settings,
	prompt: getPrompt
}
