import DateUtil from "./utils/classes.js";
import { popupInit } from "./popup/popup.js";
import { initDisplay, themeSet, toggleContainer } from "./utils/ui.js";
import { getMinYear } from "./utils/date.js";
import { generateTasks } from "./task/task.js";
import { initListeners } from "./utils/listeners.js";
import { updateDayStat, updateStat } from "./stat/stat.js";

import { randomTickInsert } from "./utils/dev.js";

document.addEventListener("keydown", async (event) => {
	if (event.key === "1") {
		await randomTickInsert();
	}
});

export const browser = chrome; // Remove if Firefox
export const storage = browser.storage;
export const local = browser.storage.local;
export const date = new DateUtil(new Date());
//chrome = null; // Change to browser if Firefox

export let timers = [];
export let viewDate = {
	yearChanger: 0,
	viewYear: date.currentYear,
	viewMonth: date.currentMonth,
	viewDay: date.currentDay,
};

export let minYear;

async function main() {
	const userData = await local.get(null);

	themeSet(userData.settings.theme.mode);

	minYear = await getMinYear(userData.tasks);

	generateTasks(userData, timers);

	updateStat(userData.tasks, viewDate.viewYear);
	updateDayStat(userData.tasks, viewDate.viewYear, viewDate.viewMonth, viewDate.viewDay);

	popupInit();
	initListeners();
	initDisplay();
	toggleContainer(userData.settings);

	storage.onChanged.addListener(async () => {
		const userData = await local.get(null);
		timers = [];
		themeSet(userData.settings.theme.mode);
		generateTasks(userData, timers);
		minYear = await getMinYear(userData.tasks);

		updateStat(userData.tasks, viewDate.viewYear);
		updateDayStat(userData.tasks, viewDate.viewYear, viewDate.viewMonth, viewDate.viewDay);
	});
}

main();
