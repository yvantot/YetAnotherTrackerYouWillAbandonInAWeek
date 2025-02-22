import { getDaysOfMonths, dateFormat } from "../utils/date.js";
import { date } from "../index.js";

function generateStats(tasks, year) {
	if (!tasks) return;
	const ticksPerMonth = {
		0: [],
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
		6: [],
		7: [],
		8: [],
		9: [],
		10: [],
		11: [],
	};

	tasks.forEach((task) => {
		task.ticks.forEach((tick) => {
			const dateTick = new Date(tick);
			if (dateTick.getFullYear() === year) {
				ticksPerMonth[dateTick.getMonth()].push(dateTick.getDate());
			}
		});
	});

	const months = document.querySelectorAll(".datamonth");
	const daysOfMonths = getDaysOfMonths(year);
	const currentMonth = date.currentMonth;
	const currentDay = date.currentDay;

	// RESET
	months.forEach((month) => {
		month.innerHTML = "";
	});

	// For every month
	months.forEach((month, index) => {
		const set = new Set(ticksPerMonth[index]);

		for (let i = 1; i <= daysOfMonths[index]; i++) {
			const tickbox = document.createElement("span");
			if (year === date.currentYear) {
				if (index <= currentMonth) {
					if (index < currentMonth || (index === currentMonth && i < currentDay)) {
						tickbox.classList.add("daybox-done");
					} else if (index === currentMonth && i === currentDay) {
						tickbox.classList.add("daybox-today");
						tickbox.setAttribute("data-tooltip", `Today is ${date.getMonth(index + 1, true)} ${i}th`);
					}
				}
			} else if (year < date.currentYear) {
				tickbox.classList.add("daybox-done");
			}
			if (set.has(i)) {
				tickbox.addEventListener("click", () => {
					// Optimize this shit so user can't click this multiple times
					updateDayStat(tasks, year, index, i);
				});
				let count = 0;
				for (let n = 0; n < ticksPerMonth[index].length; n++) {
					if (ticksPerMonth[index][n] === i) {
						count++;
					}
				}
				if (count === 1) {
					tickbox.classList.add("daybox-one");
				} else if (count >= 2 && count <= 3) {
					tickbox.classList.add("daybox-two");
				} else if (count >= 4 && count <= 6) {
					tickbox.classList.add("daybox-three");
				} else if (count >= 7 && count <= 9) {
					tickbox.classList.add("daybox-four");
				} else if (count >= 10) {
					tickbox.classList.add("daybox-five");
				}

				tickbox.setAttribute("data-tooltip", `I did ${count} task${count > 1 ? "s" : ""} on ${date.getMonth(index + 1, true)} ${i}th`);
			}

			tickbox.classList.add("daybox");
			month.appendChild(tickbox);
		}
	});
}

async function generateDaystat(tasks, year, month, day) {
	if (!tasks) return;
	const hours = document.querySelectorAll(".hours .hour");
	hours.forEach((hour) => (hour.innerHTML = ""));

	const ticks = new Set(tasks.map((task) => task.ticks).flat());

	ticks.forEach((tick) => {
		const tickDate = new Date(tick);
		const tickYear = tickDate.getFullYear();
		const tickMonth = tickDate.getMonth();
		const tickDay = tickDate.getDate();
		const tickHour = tickDate.getHours();
		const tickTime = (tickDate.getMinutes() / 60) * 100;
		if (tickYear === year && tickMonth === month && tickDay === day) {
			const tickBox = document.createElement("div");
			tickBox.classList.add("daystat-box");
			tickBox.title = tickDate.getMinutes();
			tickBox.style = `left: ${tickTime}%;`;
			hours[tickHour].appendChild(tickBox);
		}
	});
}

export function updateStat(tasks, year) {
	const statFocusedTasks = tasks.filter((task) => task.statFocused);
	if (statFocusedTasks.length > 0) {
		document.getElementById("reset-filter").classList.remove("hidden");
		generateStats(statFocusedTasks, year);
	} else {
		document.getElementById("reset-filter").classList.add("hidden");
		generateStats(tasks, year);
	}
}
export function updateDayStat(tasks, year, month, day) {
	const statFocusedTasks = tasks.filter((task) => task.statFocused);
	const newDate = new Date(year, month, day);
	const dayStatDate = document.getElementById("daystat-date");
	dayStatDate.textContent = dateFormat(newDate);

	if (statFocusedTasks.length > 0) {
		document.getElementById("reset-filter").classList.remove("hidden");
		generateDaystat(statFocusedTasks, year, month, day);
	} else {
		document.getElementById("reset-filter").classList.add("hidden");
		generateDaystat(tasks, year, month, day);
	}
}
