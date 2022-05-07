import { Client, Constants, MessageEmbed } from 'discord.js';
import customIds from './identifiers.js';
import settings from './settings.js';
import { getOnExitText, labels } from './texts.js';
import { convertDuration } from './utils.js';


export const getDefaultEmbed = (client) => {
	return {
		type: 'rich',
		thumbnail: {
			url: client.user.avatarURL(),
		}
	};
};

/////////////////////////////////////////////////////////////////////////////

const components = {
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
		// select duration
		[customIds.config[3]]: {
			type: Constants.MessageComponentTypes.SELECT_MENU,
			custom_id: customIds.config[3],
			placeholder: labels[customIds.config[3]],
			max_values: 1,
			options: settings.values.durations.map((millis) => {
				return {
					value: '' + millis,
					label: convertDuration(millis),
				};
			}),
		},
		// select amount
		[customIds.config[4]]: {
			type: Constants.MessageComponentTypes.SELECT_MENU,
			custom_id: customIds.config[4],
			placeholder: labels[customIds.config[4]],
			max_values: 1,
			options: settings.values.amounts.map((amount) => {
				return {
					value: '' + amount,
					label: amount + ' topics',
				};
			}),
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

/**
 * Default action row without components
 * @returns {array} array of action rows
 */
export const getDefaultComponents = () => {
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
/**
 * @returns {array} array of action rows
 */
export const getEditingComponents = (customId) => {
	const component = (customId === customIds.config[1])
		? components.config[customIds.config[4]]
		: components.config[customIds.config[3]];

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

export const getPromptComponents = () => {
	return [{
		type: Constants.MessageComponentTypes.ACTION_ROW,
		components: [
			components.prompt[customIds.prompt[2]], // Cancel
			components.prompt[customIds.prompt[3]], // Confirm
		],
	}];
}

export const getOnExitReply = (reason) => {
	return {
		content: getOnExitText(reason),
		embeds: [],
		components: [],
		ephemeral: true
	}
}