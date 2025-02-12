const local = chrome.storage.local;
const STORAGE_DEFAULT = {
	tasks: [
		{
			id: 0,
			title: "Double click to edit...",
			description: "...",
			ticks: [],
			createdAt: new Date() + "",
			goal: null,
			done: false,
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
