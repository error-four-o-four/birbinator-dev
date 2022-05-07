/** @todo */
const config = {

}

let topics = [];
let topicCollector;
let voteCollector;

const state = {
	active: false,
	index: 0,
}

const start = () => {
	state.active = true;
	state.index += 1;
};

const stop = () => {
	state.active = false;
	/** @todo */
	state.index = (state.index + 1) % 3;

	console.log(topics);
}

const check = (interaction) => {
	const reply = {
		content: '',
		ephemeral: true,
	}

	if (state.active) {
		reply.content = ':warning: A vote is already taking place.'
		interaction.reply(reply);
		return false;
	}

	/**
	 * @todo conditions and cases
	 * called vote but there are no topics
	 */
	if (!state.active && state.index === 1) {
		reply.content = ':warning: Already collected topic suggestions. Use `/wccc vote` to create and start.'
		interaction.reply(reply);
		return false;
	}

	// update state
	start();

	return true;
}

export default {
	topics,
	topicCollector,
	voteCollector,
	state,
	check,
	stop,
}