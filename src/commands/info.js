import fs from 'fs';
import { time } from '@discordjs/builders';
import { Client, Constants, Interaction, MessageEmbed } from 'discord.js';

const url = new URL('.', import.meta.url);
const cmdChoices = fs.readdirSync(url).filter((file) => file.endsWith('.js')).map((file) => {
	const name = file.replace('.js', '');
	return {
		name,
		value: name
	};
});

export const data = {
	name: 'info',
	description: 'Retrieve information about a user, the server or a command.',
	options: [
		{
			name: 'user',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: 'Select a user or omit this option to retrieve Your Data.',
			options: [
				{
					name: 'target',
					type: Constants.ApplicationCommandOptionTypes.USER,
					description: 'The user',
				}
			]
		},
		{
			name: 'server',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: 'Retrieve information about this server.',
		},
		{
			name: 'command',
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			description: 'Retrieve information about a command.',
			options: [
				{
					name: 'target',
					type: Constants.ApplicationCommandOptionTypes.STRING,
					description: 'The command',
					required: true,
					choices: cmdChoices,
				}
			]
		},
	],
};

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
const getUserInfoEmbed = async (client, interaction) => {
	const embed = new MessageEmbed();
	const userId = (interaction.options.data[0]?.options.length > 0)
		? interaction.options.data[0].options[0].user.id
		: interaction.user.id;
	const target = await interaction.member.guild.members.cache.get(userId).fetch();

	const delta = ~~((Date.now() - target.joinedTimestamp) / 1000 / 60 / 60 / 24);
	const joined = (delta === 0) ? `Just joined` : `Joined at ${time(target.joinedAt)} (${delta} ${(delta === 1) ? 'day' : 'days'} ago)`;
	const presence = `and is currently ${target.presence.status}.`;

	// .roles
	// .moderatable

	embed.setAuthor({
		name: `${target.user.username}#${target.user.discriminator}`,
		iconURL: target.user.avatarURL()
	});
	embed.setDescription(`${joined} ${presence}`);

	return embed;
};

const getServerInfoEmbed = async (client, interaction) => {
	const embed = new MessageEmbed();

	const { guild } = interaction.member;
	const delta = ~~((Date.now() - guild.createdTimestamp) / 1000 / 60 / 60 / 24);
	const created = `Was created at ${time(guild.createdAt)} (${delta} ${(delta === 1) ? 'day' : 'days'} ago)`;
	const members = `and currently has ${guild.memberCount} members.`;

	// .rulesChannelId

	embed.setAuthor({
		name: guild.toString(),
		iconURL: guild.iconURL()
	});
	embed.setDescription(`${created} ${members}${(guild.description) ? '\n' + guild.description : ''}`);

	return embed;
};

const getCommandInfoEmbed = async (client, interaction) => {
	const embed = new MessageEmbed();
	const target = interaction.options.data[0]?.options[0]?.value;
	const command = await import(`./${target}.js`);

	embed.setAuthor(command.data.name);
	embed.setDescription(command.data.description);
	return embed;
};

export const execute = async (client, interaction) => {
	const about = interaction.options.data[0].name;
	const embed = (about === 'user')
		? await getUserInfoEmbed(client, interaction)
		: (about === 'server')
			? await getServerInfoEmbed(client, interaction)
			: await getCommandInfoEmbed(client, interaction);

	interaction.reply({ embeds: [embed] });
};