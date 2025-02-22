import { formatTimeAgo } from "./date.js";
import { date, timers } from "../index.js";

export function themeSet(mode) {
	if (mode === "system") return;
	const html = document.documentElement;
	html.classList.remove("theme-dark", "theme-light");
	if (mode === "light") {
		html.classList.add("theme-light");
	}
	if (mode === "dark") {
		html.classList.add("theme-dark");
	}
}

export function initDisplay() {
	const statYear = document.querySelector(".stat-year");
	statYear.textContent = date.currentYear;

	setInterval(() => {
		if (timers.length > 0) {
			timers.forEach((timer) => {
				const dateRecent = new Date(timer.getAttribute("data-time"));
				timer.textContent = "Last " + formatTimeAgo(new Date() - dateRecent);
			});
		}
	}, 30000);
}

export function toggleContainer(settings) {
	if (settings && settings.visibility) {
		const { stat, list } = settings.visibility;
		const containers = document.querySelectorAll(".stats-container, .daystat-container");
		if (stat) {
			containers[0].classList.remove("hidden");
		}
		if (list) {
			containers[1].classList.remove("hidden");
		}
	}
}
