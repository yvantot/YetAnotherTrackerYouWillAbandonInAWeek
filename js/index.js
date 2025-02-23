import DateUtil from "./utils/classes.js";
import { popupInit } from "./popup/popup.js";
import { initDisplay, themeSet, toggleContainer } from "./utils/ui.js";
import { getMinYear } from "./utils/date.js";
import { generateTasks } from "./task/task.js";
import { initListeners } from "./utils/listeners.js";
import { updateDayStat, updateStat } from "./stat/stat.js";
import { tipsInit } from "./utils/tip.js";

export const browser = chrome; // Remove if Firefox
export const storage = browser.storage;
export const local = browser.storage.local;
export const date = new DateUtil(new Date());
//chrome = null; // Change to browser if Firefox
export let minYear;
export let timers = [];
export let viewDate = {
	yearChanger: 0,
	viewDateYear: date.currentYear,
	viewYear: date.currentYear,
	viewMonth: date.currentMonth,
	viewDay: date.currentDay,
};

import { randomTickInsert } from "./utils/dev.js";
document.addEventListener("keydown", ({ key }) => {
	if (key === "0") randomTickInsert();
});

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

async function main() {
	initListeners();
	tipsInit();
	popupInit();
	initDisplay();

	let userData = await local.get(null);
	if (Object.keys(userData).length === 0) {
		userData = STORAGE_DEFAULT;
		await local.set(userData);
	}

	toggleContainer(userData.settings);
	themeSet(userData.settings.theme.mode);

	minYear = await getMinYear(userData.tasks);
	generateTasks(userData, timers);
	updateStat(userData.tasks, viewDate.viewYear);
	updateDayStat(userData.tasks, viewDate.viewYear, viewDate.viewMonth, viewDate.viewDay);

	storage.onChanged.addListener(async () => {
		const userData = await local.get(null);

		timers = [];
		themeSet(userData.settings.theme.mode);

		minYear = await getMinYear(userData.tasks);
		generateTasks(userData, timers);
		updateStat(userData.tasks, viewDate.viewYear);
		updateDayStat(userData.tasks, viewDate.viewYear, viewDate.viewMonth, viewDate.viewDay);
	});
}

main();
