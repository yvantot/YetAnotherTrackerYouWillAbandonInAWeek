import { getDaysOfMonths, dateFormat } from "../utils/date.js";
import { date, viewDate } from "../index.js";

function generateStats(tasks, year) {
	if (!tasks) return;

	const tickFrequencies = new Map();
	tasks.forEach((task) => {
		task.ticks.forEach((tick) => {
			const dateTick = new Date(tick);
			if (dateTick.getFullYear() === year) {
				const key = `${dateTick.getMonth()}-${dateTick.getDate()}`;
				tickFrequencies.set(key, (tickFrequencies.get(key) || 0) + 1);
			}
		});
	});

	const months = document.querySelectorAll(".datamonth");

	const currentMonth = date.currentMonth;
	const currentDay = date.currentDay;
	const daysOfMonths = getDaysOfMonths(year);

	// For every month
	months.forEach((month, index) => {
		const fragment = document.createDocumentFragment();

		for (let i = 1; i <= daysOfMonths[index]; i++) {
			const tickbox = document.createElement("span");
			const key = `${index}-${i}`;
			const count = tickFrequencies.get(key) || 0;

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
			if (count > 0) {
				tickbox.addEventListener("click", () => {
					viewDate.viewDateYear += year - viewDate.viewDateYear;
					viewDate.viewMonth += index - viewDate.viewMonth;
					viewDate.viewDay += i - viewDate.viewDay;
					console.log(viewDate.viewDateYear, viewDate.viewMonth, viewDate.viewDay);
					updateDayStat(tasks, viewDate.viewDateYear, viewDate.viewMonth, viewDate.viewDay);
				});
				tickbox.classList.add(count === 1 ? "daybox-one" : count <= 3 ? "daybox-two" : count <= 6 ? "daybox-three" : count <= 9 ? "daybox-four" : "daybox-five");

				tickbox.setAttribute("data-tooltip", `I did ${count} task${count > 1 ? "s" : ""} on ${date.getMonth(index + 1, true)} ${i}th`);
			}

			tickbox.classList.add("daybox");
			fragment.appendChild(tickbox);
		}
		month.innerHTML = "";
		month.appendChild(fragment);
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
