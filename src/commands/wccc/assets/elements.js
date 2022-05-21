// import { Constants } from 'discord.js';
// import { convertDuration } from '../../../handlers/utils.js';

// import controller from './controller.js';
// import customIds from './identifiers.js';

// import messages from './messages.js';

// export const getDefaultEmbed = (client) => {
// 	return {
// 		type: 'rich',
// 		thumbnail: {
// 			url: client.user.avatarURL(),
// 		}
// 	};
// };

// const getSettingsMainEmbed = (client) => {
// 	return {
// 		...getDefaultEmbed(client),
// 		...messages.settings.main()
// 	}
// }

// const getTopicsMainEmbed = (client) => {
// 	return {
// 		...getDefaultEmbed(client),
// 		...messages.topics.main(),
// 	}
// }

// const getVotingMainEmbed = (client, topics) => {
// 	return {
// 		...getDefaultEmbed(client),
// 		...messages.voting.main(topics),
// 	}
// }

// const embed = {
// 	default: getDefaultEmbed,
	// settings: {
	// 	main: getSettingsMainEmbed,
	// },
// 	topicsMain: getTopicsMainEmbed,
// 	votingMain: getVotingMainEmbed
// }

// export const getEmptyEphemeralReply = () => {
// 	return {
// 		content: undefined,
// 		embeds: [],
// 		ephemeral: true,
// 		components: [],
// 	};
// };

// export const getEphemeralReply = (content) => {
// 	return {
// 		content,
// 		embeds: [],
// 		ephemeral: true,
// 		components: [],
// 	};
// };


// const reply = {
// 	ephemeralEmpty: getEmptyEphemeralReply,
// 	ephemeral: getEphemeralReply,
// }

// export default {
// 	embed,
// 	reply
// }