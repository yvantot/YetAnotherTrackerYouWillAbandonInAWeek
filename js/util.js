function dateFormat(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}.${month}.${day}`;
}

function timeFormat(date) {
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");
	return `${hour}:${minute}:${seconds}`;
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

function taskToolbar(hasGoal) {
	const elGoal = hasGoal
		? ""
		: `<button class="goal-task" title="Goal">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z"/></svg>
            </button>`;
	return ` <div class="task-toolbar">
            <button class="task-done" title="Finish">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </button>       
			${elGoal}            
            <button class="customize-task" title="Customize">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z"/></svg>
            </button>
            <button class="down-task" title="Down">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/></svg>
            </button>
            <button class="up-task" title="Up">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg>
            </button>
            <button class="delete-task" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>                        
        </div>`;
}

async function addNewTask() {
	const { tasks } = await local.get("tasks");

	if (tasks) {
		let latestID = null;
		if (tasks.length > 0) {
			latestID = tasks[tasks.length - 1].id + 1;
		} else {
			latestID = 0;
		}

		const defaultTask = {
			id: latestID,
			title: "Double click to change...",
			description: "Hover to the right upperside for settings",
			createdAt: String(new Date()),
			goal: null,
			done: false,
			ticks: [],
		};

		tasks.push(defaultTask);
		await local.set({ tasks });
	}
}

function generateStats(userData, year) {
	const { tasks } = userData;
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
	const daysOfMonths = date.getDaysOfMonths();
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
						tickbox.setAttribute("style", "background-color: hsl(0, 0%, 75%); border: none;");
					} else if (index === currentMonth && i === currentDay) {
						tickbox.setAttribute("style", "background-color: hsl(0, 0%, 50%); border: none;");
					}
				}
			} else if (year < date.currentYear) {
				tickbox.setAttribute("style", "background-color: hsl(0, 0%, 75%); border: none;");
			}

			if (set.has(i)) {
				tickbox.setAttribute("style", "background-color: hsl(135, 50%, 50%); border: none;");
			}

			tickbox.classList.add("daybox");
			month.appendChild(tickbox);
		}
	});
}

function generateTasks(userData) {
	document.querySelector(".usertasks").innerHTML = "";
	const { tasks } = userData;
	if (tasks) {
		tasks.forEach((task) => {
			createTask(task);
		});
	}
}

function initListeners() {
	const addTask = document.getElementById("add-task");

	addTask.addEventListener("click", addNewTask);
}

function initDisplay() {
	const currentDate = document.querySelector(".current-date");
	const currentTime = document.querySelector(".current-time");
	const statYear = document.querySelector(".stat-year");

	statYear.textContent = date.currentYear;

	let timeUpdate = new Date();
	currentDate.textContent = dateFormat(timeUpdate);
	currentTime.textContent = timeFormat(timeUpdate);

	// Update stats time
	setInterval(() => {
		// Current date & time
		timeUpdate = new Date();
		currentDate.textContent = dateFormat(timeUpdate);
		currentTime.textContent = timeFormat(timeUpdate);
	}, 1000);

	// Update task timers
	setInterval(() => {
		if (timers.length > 0) {
			timers.forEach((timer) => {
				const dateRecent = new Date(timer.getAttribute("data-time"));
				timer.textContent = "Last " + formatTimeAgo(new Date() - dateRecent);
			});
		}
	}, 30000);
}

function taskHeader(title, description, createdAt, goal, ticks) {
	const time = ticks.length === 0 ? formatTimeAgo(new Date() - new Date(createdAt)) : formatTimeAgo(new Date() - new Date(ticks[ticks.length - 1]));

	let goalProgress = "";
	if (goal) {
		goalProgress = `
			<span class="ticks-count">/</span>
			<span class="ticks-count" data-hasgoal="true" contentEditable="false">${goal}</span>
		`;
	}

	return `<div class="task-info">
            <h3 data-type="title" contentEditable="false">${title}</h3>
            <span data-type="description" contentEditable="false">${description}</span>
            <span class="task-createdAt">${dateFormat(new Date(createdAt))}</span>
        </div>
        <div class="horizontal-line"></div>
        <div class="tick-ago">
            <span class="tick-info">
                <span class="ticks-count">${goal ? ticks.length % goal : ticks.length}</span>
				${goal ? goalProgress : ""}
            </span>            
            <span class="time-after" data-time="${ticks.length === 0 ? createdAt : ticks[ticks.length - 1]}">Last ${time}</span>            
        </div>`;
}
function taskListeners(header, main, id) {
	const taskTitle = header.querySelector("h3");
	const taskDescription = header.querySelector(".task-info span");
	const taskDone = header.querySelector(".task-done");
	const taskDelete = header.querySelector(".delete-task");
	const taskGoal = header.querySelector(".goal-task");
	const taskUp = header.querySelector(".up-task");
	const taskDown = header.querySelector(".down-task");
	const goalEdit = header.querySelector("span[data-hasgoal='true']");
	const taskCustomize = header.querySelector(".customize-task");
	const tickAdd = main.querySelector(".tick-add");
	const tickDelete = main.querySelector(".tick-delete");

	async function getSetTask(callback, id) {
		const { tasks } = await local.get("tasks");
		const index = tasks.findIndex((task) => task.id === id);
		if (index !== -1) {
			callback({ tasks, index, task: tasks[index] }); // JS passes objects by reference
			await local.set({ tasks }); // After operation, set the storage
		}
		return;
	}

	taskDone.addEventListener("click", () => {
		getSetTask(({ task }) => {
			task.done = !task.done;
		}, id);
	});

	taskDelete.addEventListener("click", () => {
		getSetTask(({ tasks, index }) => {
			tasks.splice(index, 1);
		}, id);
	});

	taskUp.addEventListener("click", () => {
		getSetTask(({ tasks, index }) => {
			if (index > 0) [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
		}, id);
	});

	taskDown.addEventListener("click", () => {
		getSetTask(({ tasks, index }) => {
			if (index < tasks.length - 1) [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
		}, id);
	});

	taskCustomize.addEventListener("click", () => {
		alert("Customize");
	});

	function goalSanitizeInput(string) {
		if (string.trim()) {
			let goal = parseInt(string);
			if (isNaN(goal)) {
				goal = 0;
			}
			return Math.abs(Math.floor(goal));
		}
		return 0;
	}

	if (goalEdit) {
		goalEdit.addEventListener("keydown", ({ target, code, key, keyCode }) => {
			if (code === "Enter" || key === "Enter" || keyCode === 13) {
				const isEditable = target.getAttribute("contentEditable") === "true";
				target.setAttribute("contentEditable", !isEditable);
				target.classList.toggle("goal-edit", false);

				if (isEditable) {
					getSetTask(({ task }) => {
						task.goal = goalSanitizeInput(target.textContent);
					}, id);
				}
			}
		});

		goalEdit.addEventListener("dblclick", ({ target }) => {
			const isEditable = target.getAttribute("contentEditable") === "true";
			target.setAttribute("contentEditable", !isEditable);
			target.classList.toggle("goal-edit");
			target.focus();

			if (isEditable) {
				getSetTask(({ task }) => {
					task.goal = goalSanitizeInput(target.textContent);
				}, id);
			}
		});
	}

	taskGoal?.addEventListener("click", () => {
		if (header.querySelector("span[data-hasgoal='true']")) return;
		console.log("Hey");
		const elParent = header.querySelector(".tick-info");
		const elDivider = document.createElement("span");
		const elGoal = document.createElement("span");

		elDivider.classList.add("ticks-count");
		elGoal.classList.toggle("goal-edit", true);

		elGoal.setAttribute("contentEditable", "true");
		elGoal.setAttribute("data-hasgoal", "true");

		elDivider.textContent = "/";
		elGoal.textContent = "5";

		elParent.appendChild(elDivider);
		elParent.appendChild(elGoal);
		elGoal.focus();

		elGoal.addEventListener("keydown", ({ target, code, key, keyCode }) => {
			if (code === "Enter" || key === "Enter" || keyCode === 13) {
				const isEditable = target.getAttribute("contentEditable") === "true";
				target.setAttribute("contentEditable", !isEditable);
				target.classList.toggle("goal-edit", false);

				getSetTask(({ task }) => {
					task.goal = goalSanitizeInput(target.textContent);
				}, id);
			}
		});

		elGoal.addEventListener("dblclick", ({ target }) => {
			const isEditable = target.getAttribute("contentEditable") === "true";
			target.setAttribute("contentEditable", !isEditable);
			target.classList.toggle("goal-edit", false);

			getSetTask(({ task }) => {
				task.goal = goalSanitizeInput(target.textContent);
			}, id);
		});
	});

	function infoListener(element, id) {
		element.addEventListener("dblclick", (event) => {
			const self = event.target;
			const type = self.getAttribute("data-type");
			const isEditable = self.getAttribute("contentEditable") === "true";
			self.setAttribute("contentEditable", String(!isEditable));
			self.classList.toggle("editing-info");
			self.focus();

			if (isEditable) {
				getSetTask(({ task }) => {
					task[type] = element.textContent;
				}, id);
			}
		});

		element.addEventListener("keydown", (event) => {
			if (event.code === "Enter" || event.key === "Enter" || event.keyCode === 13) {
				const self = event.target;
				const type = self.getAttribute("data-type");
				const isEditable = self.getAttribute("contentEditable") === "true";
				self.setAttribute("contentEditable", String(!isEditable));
				self.classList.toggle("editing-info");
				self.focus();

				if (isEditable) {
					getSetTask(({ task }) => {
						task[type] = element.textContent;
					}, id);
				}
			}
		});
	}

	tickDelete.addEventListener("click", () => {
		getSetTask(({ task }) => {
			task.ticks.pop();
		}, id);
	});

	tickAdd.addEventListener("click", () => {
		getSetTask(({ task }) => {
			task.ticks.push(String(new Date()));
		}, id);
	});

	infoListener(taskTitle, id);
	infoListener(taskDescription, id);
}
