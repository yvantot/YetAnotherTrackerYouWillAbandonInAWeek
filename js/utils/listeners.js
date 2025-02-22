import { addNewTask } from "../task/task.js";
import { updateDayStat, updateStat } from "../stat/stat.js";
import { getMaxNumber } from "./utils.js";
import { dateFormat } from "./date.js";
import { date, local, browser, viewDate, minYear } from "../index.js";

export async function initListeners() {
	// Add task: Create a new task
	document.getElementById("add-task").addEventListener("click", addNewTask);
	// Popup: Open as a newtab
	document.querySelector(".open-tab").setAttribute("href", `${browser.runtime.getURL("html/newtab.html?mode=extension")}`);
	// Day stat: Init UI
	document.getElementById("daystat-date").textContent = dateFormat(new Date());
	// Theme toggle in settings
	document.getElementById("change-theme").addEventListener("click", async () => {
		const { settings } = await local.get("settings");
		if (settings.theme.mode === "system") {
			settings.theme.mode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";
		} else {
			settings.theme.mode = settings.theme.mode === "dark" ? "light" : "dark";
		}
		await local.set({ settings });
	});
	// Export/download data in settings
	document.getElementById("export-data").addEventListener("click", async () => {
		const userData = await local.get(null);
		const json = JSON.stringify(userData);
		const data = btoa(json); // To make cheating significantly harder for non-tech people
		const blob = new Blob([data], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const download = document.createElement("a");
		download.href = url;
		download.download = `YATYA-${dateFormat(new Date())}.yatya`;
		document.body.appendChild(download);
		download.click();
		download.remove();
		URL.revokeObjectURL(url);
	});
	// Add tasks from data feature in settings
	document.getElementById("add-data").addEventListener("change", async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const extension = file.name.split(".").pop();
		if (extension === "yatya") {
			const { tasks } = await local.get("tasks");

			let latestID = getMaxNumber(tasks.map((task) => task.id));
			if (tasks.length !== 0) latestID += 1;

			const userData = JSON.parse(atob(await file.text()));
			if (userData.tasks.length > 0) {
				userData.tasks.forEach((task, index) => {
					task.id = latestID;
					latestID += index + 1;
					tasks.push(task);
				});
				await local.set({ tasks });
			}
		} else {
			alert("Invalid file");
		}
	});
	// Replace current data with file feature in settings
	document.getElementById("import-data").addEventListener("change", async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const extension = file.name.split(".").pop();
		if (extension === "yatya") {
			const isConfirmed = window.confirm("This action is irreversible and will overwrite all of your data, proceed?");
			if (isConfirmed) {
				const data = JSON.parse(atob(await file.text()));
				await local.set(data);
			}
		} else {
			alert("Invalid file");
		}
	});
	// Reset stat focused feature
	document.getElementById("reset-filter").addEventListener("click", async () => {
		const { tasks } = await local.get("tasks");
		tasks.forEach((task) => (task.statFocused = false));
		await local.set({ tasks });
	});
	// Open setting button
	document.getElementById("settings").addEventListener("click", () => {
		document.querySelector(".settings-container").classList.toggle("hidden", false);
	});
	// Close setting button
	document.getElementById("close-setting").addEventListener("click", () => {
		document.querySelector(".settings-container").classList.toggle("hidden", true);
	});

	async function toggleStat() {
		const { settings } = await local.get("settings");

		if (settings && settings.visibility) {
			document.querySelector(".stats-container").classList.toggle("hidden");
			settings.visibility.stat = !settings.visibility.stat;
			await local.set({ settings });
		}
	}

	async function toggleDaystat() {
		const { settings } = await local.get("settings");
		if (settings && settings.visibility) {
			document.querySelector(".daystat-container").classList.toggle("hidden");
			settings.visibility.list = !settings.visibility.list;
			await local.set({ settings });
		}
	}

	// Toggle shortcut keys
	document.addEventListener("keydown", ({ key }) => {
		if (key === "1") toggleStat();
		if (key === "2") toggleDaystat();
	});

	// Toggle year stat
	document.getElementById("toggle-stat").addEventListener("click", () => {
		toggleStat();
	});
	// Toggle day stat
	document.getElementById("toggle-list").addEventListener("click", () => {
		toggleDaystat();
	});
	// Previous year stat
	document.getElementById("prev-year").addEventListener("click", async () => {
		if (date.currentYear + viewDate.yearChanger <= minYear) return;

		const { tasks } = await local.get("tasks");
		viewDate.yearChanger -= 1;
		viewDate.viewYear = date.currentYear + viewDate.yearChanger;
		document.querySelector(".stat-year").textContent = viewDate.viewYear;
		updateStat(tasks, viewDate.viewYear);
	});
	// Next year stat
	document.getElementById("next-year").addEventListener("click", async () => {
		if (viewDate.yearChanger >= 0) return;

		const { tasks } = await local.get("tasks");
		viewDate.yearChanger += 1;
		viewDate.viewYear = date.currentYear + viewDate.yearChanger;
		document.querySelector(".stat-year").textContent = viewDate.viewYear;
		updateStat(tasks, viewDate.viewYear);
	});
	// Previous date stat
	document.getElementById("prev-date").addEventListener("click", async () => {
		if (viewDate.viewDateYear < minYear) return;

		const { tasks } = await local.get("tasks");
		const latestDate = new Date(viewDate.viewDateYear, viewDate.viewMonth, 0);

		if (viewDate.viewDay <= 1) {
			viewDate.viewDay = latestDate.getDate();
			if (viewDate.viewMonth <= 0) {
				viewDate.viewMonth = 11;
				viewDate.viewDateYear -= 1;
			} else {
				viewDate.viewMonth -= 1;
			}
		} else {
			viewDate.viewDay -= 1;
		}
		updateDayStat(tasks, viewDate.viewDateYear, viewDate.viewMonth, viewDate.viewDay);
	});
	// Next date stat
	document.getElementById("next-date").addEventListener("click", async () => {
		const tempDate = new Date(viewDate.viewDateYear, viewDate.viewMonth, viewDate.viewDay);
		if (tempDate.getFullYear() === date.currentYear && tempDate.getMonth() === date.currentMonth && tempDate.getDate() === date.currentDay) return;

		const { tasks } = await local.get("tasks");
		const latestDate = new Date(viewDate.viewDateYear, viewDate.viewMonth + 1, 0);

		if (viewDate.viewDay >= latestDate.getDate()) {
			viewDate.viewDay = 1;
			if (viewDate.viewMonth >= 11) {
				viewDate.viewMonth = 0;
				viewDate.viewDateYear += 1;
			} else {
				viewDate.viewMonth += 1;
			}
		} else {
			viewDate.viewDay += 1;
		}
		updateDayStat(tasks, viewDate.viewDateYear, viewDate.viewMonth, viewDate.viewDay);
	});
}
