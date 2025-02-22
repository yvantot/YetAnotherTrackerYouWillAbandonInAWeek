const local = chrome.storage.local;
const STORAGE_DEFAULT = {
	settings: {
		theme: {
			mode: "system",
		},
		visibility: {
			stat: true,
			list: true,
		},
	},

	tasks: [
		{
			id: 0,
			title: "Double click to change...",
			description: "Hover to the right upperside for settings",
			createdAt: String(new Date()),
			goal: 0,
			done: false,
			minimizeTick: false,
			type: "generic",
			statFocused: false,
			ticks: [],
		},
	],
};

function init() {
	initStorage();
}

async function initStorage() {
	const { tasks } = await local.get("tasks");
	if (!tasks) {
		await local.set(STORAGE_DEFAULT);
	}
}

init();
