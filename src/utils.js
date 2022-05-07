export const logCyan = '\x1b[36m%s\x1b[0m';
export const logYellow = '\x1b[33m%s\x1b[0m';

export const logTime = () => {
	const d = new Date();
	return `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`;
}

export default {
	cyan: logCyan,
	yellow: logYellow,
	time: logTime,
}