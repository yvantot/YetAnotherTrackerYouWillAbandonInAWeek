import { getRandom } from "./utils.js";

export async function randomTickInsert() {
	const { tasks } = await chrome.storage.local.get("tasks");
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
						const hour = getRandom(0, 23);
						const minute = getRandom(0, 59);
						const second = getRandom(0, 59);
						task.ticks.push(String(new Date(year, month, day, hour, minute, second)));
					}
				} else {
					const day = getRandom(1, new Date(year, month, 0).getDate());
					for (let k = 0; k < amount; k++) {
						const hour = getRandom(0, 23);
						const minute = getRandom(0, 59);
						const second = getRandom(0, 59);
						task.ticks.push(String(new Date(year, month, day, hour, minute, second)));
					}
				}
			} else {
				const month = getRandom(0, 12);
				const day = getRandom(1, new Date(year, month, 0).getDate());
				for (let k = 0; k < amount; k++) {
					const hour = getRandom(0, 23);
					const minute = getRandom(0, 59);
					const second = getRandom(0, 59);
					task.ticks.push(String(new Date(year, month, day, hour, minute, second)));
				}
			}
		}
	});
	await chrome.storage.local.set({ tasks });
}
