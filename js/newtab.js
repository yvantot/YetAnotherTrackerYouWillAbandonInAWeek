// CLASSES
class DateUtil {
	constructor(date) {
		this.date = date;
	}
	getDaysOfMonths() {
		const days = [];
		for (let i = 1; i <= 12; i++) {
			days.push(new Date(this.date.getFullYear(), i, 0).getDate());
		}
		return days;
	}
	// For Month representation
	getCurrentMonth(date = this.date, isAbbrev = false, isNum = false) {
		const currentMonth = date.getMonth() + 1;
		switch (currentMonth) {
			case 1:
				if (isAbbrev) return "Jan";
				if (isNum) return 1;
				return "January";
			case 2:
				if (isAbbrev) return "Feb";
				if (isNum) return 2;
				return "February";
			case 3:
				if (isAbbrev) return "Mar";
				if (isNum) return 3;
				return "March";
			case 4:
				if (isAbbrev) return "Apr";
				if (isNum) return 4;
				return "April";
			case 5:
				if (isNum) return 5;
				return "May";
			case 6:
				if (isNum) return 6;
				return "June";
			case 7:
				if (isNum) return 7;
				return "July";
			case 8:
				if (isAbbrev) return "Aug";
				if (isNum) return 8;
				return "August";
			case 9:
				if (isAbbrev) return "Sep";
				if (isNum) return 9;
				return "September";
			case 10:
				if (isAbbrev) return "Oct";
				if (isNum) return 10;
				return "October";
			case 11:
				if (isAbbrev) return "Nov";
				if (isNum) return 11;
				return "November";
			case 12:
				if (isAbbrev) return "Dec";
				if (isNum) return 12;
				return "December";
			default:
				throw new Error("Unexpected value");
		}
	}
}

// GLOBAL VARIABLES
const local = chrome.storage.local;
let timers = [];
const date = new DateUtil(new Date());

async function generateStats() {
	const months = document.querySelectorAll(".datamonth");
	const days = date.getDaysOfMonths();

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

	const { tasks } = await local.get("tasks");
	tasks.forEach((task) => {
		task.ticks.forEach((tick) => {
			const dateTick = new Date(tick);
			ticksPerMonth[dateTick.getMonth()].push(dateTick.getDate());
		});
	});

	(async () => {
		const currentMonth = new Date().getMonth();
		const currentDay = new Date().getDate();
		months.forEach((month, index) => {
			const set = new Set(m[index]);
			for (let i = 0; i < days[index]; i++) {
				const box = document.createElement("div");
				if (index <= currentMonth) {
					if (index === currentMonth && i < currentDay) {
						box.style.backgroundColor = "hsl(0, 0%, 80%)";
						box.style.border = "none";
					} else if (index < currentMonth) {
						box.style.backgroundColor = "hsl(0, 0%, 80%)";
						box.style.border = "none";
					}
				}
				if (index === currentMonth && i === currentDay - 1) {
					box.style.backgroundColor = "hsl(0, 0.00%, 50.20%)";
					box.style.border = "none";
				}
				if (set.has(i + 1)) {
					box.style.backgroundColor = "hsl(135, 50%, 50%)";
					box.style.border = "none";
				}
				box.classList.add("daybox");
				month.appendChild(box);
			}
		});
	})();
}

generateStats();

const addTask = document.getElementById("add-task");

addTask.addEventListener("click", async () => {
	/* No handler when there's no task */
	const { tasks } = await local.get("tasks");
	tasks.push({
		id: tasks[tasks.length - 1].id + 1,
		title: "Double click to edit",
		description: "...",
		ticks: [],
		createdAt: new Date() + "",
		goal: null,
		done: false,
	});
	await local.set({ tasks });
});

function createTask(task) {
	const { id, ticks, title, description, createdAt, goal, done } = task;
	if (done) {
		/* Instead of creating a new container, just minimize done and make them a little square with a button to undone */
		return;
	}
	const parent = document.querySelector(".usertask-container");
	const container = document.createElement("div");
	container.setAttribute("class", "usertask");
	container.setAttribute("data-id", id);
	const time = ticks.length === 0 ? formatTimeAgo(new Date() - new Date(createdAt)) : formatTimeAgo(new Date() - new Date(ticks[ticks.length - 1]));

	const header = document.createElement("header");
	header.innerHTML = `
        <div class="task-toolbar">
            <button id="task-done" title="Finish">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </button>        
            <button id="goal-task" title="Goal">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z"/></svg>
            </button>        
            <button id="edit-task" title="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg>
            </button>
            <button id="customize-task" title="Customize">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z"/></svg>
            </button>
            <button id="down-task" title="Down">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/></svg>
            </button>
            <button id="up-task" title="Up">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg>
            </button>
            <button id="delete-task" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>                        
        </div>
        <div class="task-info">
            <h3 contentEditable="false">${title}</h3>
            <span contentEditable="false">${description}</span>
        </div>
        <div class="horizontal-line"></div>
        <div class="tick-ago">
            <span class="tick-info">            
                <span class="ticks-count">${goal ? ticks.length % goal : ticks.length}</span>
            </span>            
            <span class="time-after" title="DD:HH:MM" data-time="${ticks.length === 0 ? createdAt : ticks[ticks.length - 1]}">Last ${time}</span>
            <span>${dateToYYYYMMDD(new Date(createdAt))}</span>
        </div>
    `;
	/* Fix the shit above by using if statement where 0/GOAL should be 1/GOAL jesus fucking ternary*/
	/* Also if has a goal, add a counter that counts the goal, should be fairly easy */

	if (goal) {
		const goalEl = document.createElement("span");
		const divider = document.createElement("span");
		divider.classList.add("ticks-count");
		goalEl.setAttribute("contentEditable", "false");
		const par = header.querySelector(".tick-info");

		divider.textContent = "/";
		goalEl.classList.add("ticks-count");
		goalEl.textContent = goal;

		goalEl.addEventListener("dblclick", async (event) => {
			alert("Change");
		});

		par.appendChild(divider);
		par.appendChild(goalEl);
	}

	header.querySelector("#task-done").addEventListener("click", async (event) => {
		const { tasks } = await local.get(null);
		const index = tasks.findIndex((task) => task.id === id);
		tasks[index].done = true;
		await local.set({ tasks });
	});

	/* I should store reference the task itself instead of getting every storage everytime finding index */
	header.querySelector("#delete-task").addEventListener("click", async (event) => {
		const { tasks } = await local.get(null);
		const index = tasks.findIndex((task) => task.id === id);
		if (index !== -1) {
			tasks.splice(index, 1);
			await local.set({ tasks });
		}
	});
	header.querySelector("#goal-task").addEventListener("click", async (event) => {
		/* If already exist return */
		const divider = document.createElement("span");
		const goalEl = document.createElement("span");
		divider.classList.add("ticks-count");
		goalEl.setAttribute("style", "border-bottom: 2px solid hsl(0, 0%, 70%);");
		goalEl.setAttribute("contentEditable", "true");
		const par = header.querySelector(".tick-info");

		divider.textContent = "/";
		goalEl.classList.add("ticks-count");
		goalEl.textContent = "10";

		goalEl.addEventListener("dblclick", async (event) => {
			const { tasks } = await local.get("tasks");
			const index = tasks.findIndex((task) => task.id === id);
			tasks[index].goal = parseInt(goalEl.textContent);
			await local.set({ tasks });
		});

		par.appendChild(divider);
		par.appendChild(goalEl);
	});
	header.querySelector("#up-task").addEventListener("click", async (event) => {
		/* No handler if already highest */
		const { tasks } = await local.get(null);
		const index = tasks.findIndex((task) => task.id === id);
		const currentPos = index;
		const upperPos = index - 1;
		[tasks[currentPos], tasks[upperPos]] = [tasks[upperPos], tasks[currentPos]];
		await local.set({ tasks });
	});
	header.querySelector("#down-task").addEventListener("click", async (event) => {
		/* No handler if already lowest */
		const { tasks } = await local.get(null);
		const index = tasks.findIndex((task) => task.id === id);
		const currentPos = index;
		const upperPos = index + 1;
		[tasks[currentPos], tasks[upperPos]] = [tasks[upperPos], tasks[currentPos]];
		await local.set({ tasks });
	});
	header.querySelector("#customize-task").addEventListener("click", (event) => {
		alert("Customize");
	});
	header.querySelector("#edit-task").addEventListener("click", (event) => {
		alert("Edit");
	});

	const timer = header.querySelector(".time-after");
	timers.push(timer);

	async function saveTitle(element, id) {
		const { tasks } = await local.get("tasks");
		const index = tasks.findIndex((task) => task.id === id);
		const task = tasks[index];
		task.title = element.textContent;
		await local.set({ tasks });
	}

	async function saveDescription(element, id) {
		const { tasks } = await local.get("tasks");
		const index = tasks.findIndex((task) => task.id === id);
		const task = tasks[index];
		task.description = element.textContent;
		await local.set({ tasks });
	}

	header.querySelector("h3").addEventListener("keydown", (event) => {
		if (event.code === "Enter" || event.key === "Enter" || event.keyCode === 13) {
			const self = event.target;
			const isEditable = self.getAttribute("contentEditable") === "true";
			self.setAttribute("contentEditable", !isEditable);
			saveTitle(self, id);

			if (!isEditable) {
				self.style.color = "gray";
				self.style.borderBottom = "2px solid hsl(0, 0%, 70%)";
			} else {
				self.style.color = "#242424";
				self.style.borderBottom = "none";
			}
		}
	});
	header.querySelector("h3").addEventListener("dblclick", (event) => {
		const self = event.target;
		const isEditable = self.getAttribute("contentEditable") === "true";
		self.setAttribute("contentEditable", !isEditable);
		saveTitle(self, id);

		if (!isEditable) {
			self.style.color = "gray";
			self.style.borderBottom = "2px solid hsl(0, 0%, 70%)";
		} else {
			self.style.color = "#242424";
			self.style.borderBottom = "none";
		}
	});

	header.querySelector(".task-info span").addEventListener("dblclick", (event) => {
		const self = event.target;
		const isEditable = self.getAttribute("contentEditable") === "true";
		self.setAttribute("contentEditable", !isEditable);

		saveDescription(self, id);
		if (!isEditable) {
			self.style.color = "gray";
			self.style.borderBottom = "2px solid hsl(0, 0%, 70%)";
		} else {
			self.style.color = "#242424";
			self.style.borderBottom = "none";
		}
	});

	let progress = "";
	for (let i = 0; i < ticks.length; i++) {
		progress += `<div class="tick" title="${dateToYYYYMMDD(new Date(ticks[i]))}"></div>`;
		if (goal) {
			console.clear();
			console.log(i, goal, i % goal === 0);
			if ((i + 1) % goal === 0) {
				progress += `<div class="tick-divider"></div>`;
			}
		}
	}

	const main = document.createElement("div");
	main.setAttribute("class", "tick-container");
	main.innerHTML = `               
        <div class="tick-delete" ${ticks.length === 0 ? "style='display:none;'" : ""}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-440v-80h560v80H200Z"/></svg>
        </div>
        ${progress}
        <div class="tick-add">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>
        </div>
    `;

	main.querySelector(".tick-delete").addEventListener("click", async () => {
		const { tasks } = await local.get("tasks");
		const task = tasks[id];
		task.ticks.pop();
		await local.set({ tasks });
	});

	main.querySelector(".tick-add").addEventListener("click", async () => {
		const { tasks } = await local.get("tasks");
		const task = tasks[id];
		task.ticks.push(new Date() + "");
		await local.set({ tasks });
	});

	container.appendChild(header);
	container.appendChild(main);
	parent.appendChild(container);
}

async function init() {
	const data = await local.get(null);
	const tasks = data.tasks;

	tasks.forEach((task) => {
		createTask(task);
	});
}

chrome.storage.onChanged.addListener(async () => {
	timers = [];
	/* Create a new div that holds all usertasks */
	document.querySelectorAll(".usertask-container .usertask").forEach((child) => child.remove());
	const data = await local.get(null);
	const tasks = data.tasks;

	tasks.forEach((task) => {
		createTask(task);
	});
});

function dateToYYYYMMDD(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}/${month}/${day}`;
}

function formatTimeAgo(ms) {
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

setInterval(() => {
	if (timers.length > 0) {
		timers.forEach((timer) => {
			const dateRecent = new Date(timer.getAttribute("data-time"));
			timer.textContent = "Last " + formatTimeAgo(new Date() - dateRecent);
		});
	}
}, 1000);

init();
