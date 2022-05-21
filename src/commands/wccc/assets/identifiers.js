export const customIds = {
	config: [
		'topic_time',
		'topics_max',
		'voting_time',
	],
	select: [
		'select_duration',
		'select_maximum',
	],
	prompt: [
		'prompt_exit',
		'prompt_back',
		'prompt_cancel',
		'prompt_confirm',
	]
};

export const labels = {
	[customIds.config[0]]: 'Topic Suggestion Duration',
	[customIds.config[1]]: 'Maximum Topics',
	[customIds.config[2]]: 'Voting Duration',
	[customIds.select[0]]: 'Choose a duration',
	[customIds.select[1]]: 'Choose a maximum amount',
	[customIds.prompt[0]]: 'Exit',
	[customIds.prompt[1]]: 'Back',
	[customIds.prompt[2]]: 'Cancel',
	[customIds.prompt[3]]: 'Confirm',
};
