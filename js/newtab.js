const local = chrome.storage.local;
const date = new DateUtil(new Date());
let timers = [];
let yearChanger = 0;

chrome.storage.onChanged.addListener(async () => {
	const userData = await local.get(null);
	console.log(userData.tasks);

	timers = [];
	generateTasks(userData);
	generateStats(userData, date.currentYear);
});

async function init() {
	const userData = await local.get(null);
	generateTasks(userData);
	generateStats(userData, date.currentYear);

	initListeners();
	initDisplay();
}

init();
