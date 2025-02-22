import { getMinNumber } from "./utils.js";
import { date } from "../index.js";

export function dateFormat(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function formatTimeAgo(ms) {
	const MS_IN_SECOND = 1000;
	const MS_IN_MINUTE = MS_IN_SECOND * 60;
	const MS_IN_HOUR = MS_IN_MINUTE * 60;
	const MS_IN_DAY = MS_IN_HOUR * 24;

	let days = Math.floor(ms / MS_IN_DAY);
	let hours = Math.floor((ms % MS_IN_DAY) / MS_IN_HOUR);
	let minutes = Math.floor((ms % MS_IN_HOUR) / MS_IN_MINUTE);

	if (days > 0) {
		return `${String(days)} day ${String(hours)} hour ${String(minutes)} minutes ago`;
	} else if (hours > 0) {
		return `${String(hours)} hour ${String(minutes)} minutes ago`;
	} else {
		return `${String(minutes)} minutes ago`;
	}
}
export function getDaysOfMonths(year) {
	const days = [];
	for (let i = 1; i <= 12; i++) {
		days.push(new Date(year, i, 0).getDate());
	}
	return days;
}

export async function getMinYear(tasks) {
	if (tasks) {
		const ticks = tasks.map((task) => task.ticks).flat();
		if (ticks.length === 0) return date.currentYear;
		const years = new Set(ticks.map((tick) => new Date(tick).getFullYear()));
		return getMinNumber(Array.from(years));
	}
}
