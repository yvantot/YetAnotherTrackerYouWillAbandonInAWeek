const local = chrome.storage.local;
const date = new DateUtil(new Date());
let timers = [];
let yearChanger = 0;
let viewYear = date.currentYear;
let minYear;

// DEVELOPER FUNCTIONS
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function randomTickInsert() {
	const { tasks } = await local.get("tasks");
	const date = new Date();

	tasks.forEach((task) => {
		for (let i = 0; i < 20; i++) {
			const year = getRandom(2024, 2025);
			const amount = getRandom(0, 10);
			if (year === date.getFullYear()) {
				const month = getRandom(0, date.getMonth());
				if (month === date.getMonth()) {
					const day = getRandom(1, date.getDate());
					for (let k = 0; k < amount; k++) {
						task.ticks.push(String(new Date(year, month, day)));
					}
				} else {
					const day = getRandom(1, new Date(year, month, 0).getDate());
					for (let k = 0; k < amount; k++) {
						task.ticks.push(String(new Date(year, month, day)));
					}
				}
			} else {
				const month = getRandom(0, 12);
				const day = getRandom(1, new Date(year, month, 0).getDate());
				for (let k = 0; k < amount; k++) {
					task.ticks.push(String(new Date(year, month, day)));
				}
			}
		}
	});
	await local.set({ tasks });
}

chrome.storage.onChanged.addListener(async () => {
	const userData = await local.get(null);
	const statYear = document.querySelector(".stat-year");
	statYear.textContent = new Date().getFullYear();
	yearChanger = 0;
	viewYear = date.currentYear;
	timers = [];
	generateTasks(userData);
	minYear = await getMinYear(userData.tasks);
	updateStat(userData, viewYear);
});

async function init() {
	const userData = await local.get(null);

	minYear = await getMinYear(userData.tasks);

	generateTasks(userData);
	updateStat(userData, viewYear);

	popupInit();
	initListeners();
	initDisplay();
	toggleContainer(userData.settings);
}

function toggleContainer(settings) {
	if (settings && settings.visibility) {
		const { stat, list } = settings.visibility;
		const containers = document.querySelectorAll(".stats-container, .todolist-container");
		if (stat) {
			containers[0].classList.remove("hidden");
		}
		if (list) {
			containers[1].classList.remove("hidden");
		}
	}
}

init();
