import { dateFormat, formatTimeAgo } from "../utils/date.js";
import { local, date, timers } from "../index.js";
import { getMaxNumber } from "../utils/utils.js";

export async function addNewTask() {
	const { tasks } = await local.get("tasks");

	if (tasks) {
		let latestID = getMaxNumber(tasks.map((task) => task.id));
		if (tasks.length !== 0) latestID += 1;
		const defaultTask = {
			id: latestID,
			title: "Double click this to change...",
			description: "Hover to the right upperside for settings",
			createdAt: String(new Date()),
			goal: 0,
			done: false,
			type: "generic",
			ticks: [],
		};

		tasks.push(defaultTask);
		await local.set({ tasks });
	}
}

export function generateTasks(userData) {
	document.querySelector(".usertasks").innerHTML = "";
	const { tasks } = userData;
	if (tasks) {
		const doneTask = [];
		tasks.forEach((task) => {
			if (!task.done) {
				createTask(task);
			} else {
				doneTask.push(task);
			}
		});
		doneTask.forEach((task) => {
			createTask(task);
		});
	}
}

function createTask(task) {
	const { id, ticks, title, description, createdAt, goal, done, statFocused, minimizeTick } = task;
	const parent = document.querySelector(".usertasks");
	const header = document.createElement("header");
	const main = document.createElement("div");
	const container = document.createElement("div");

	main.setAttribute("class", "tick-container");
	container.setAttribute("class", "usertask");

	header.innerHTML = `       
	   ${taskHeader(title, description, createdAt, goal, ticks)}
	   ${taskToolbar(goal, statFocused, minimizeTick)}
	`;

	main.innerHTML = `               
		<div class="tick-delete" ${ticks.length === 0 ? "style='display:none;'" : ""}>
			<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-440v-80h560v80H200Z"/></svg>
		</div>
		${done ? "" : tickProgress(goal, ticks, minimizeTick)}
		<div class="tick-add">
			<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>
		</div>
	`;

	if (done) {
		container.classList.toggle("task-done");
	}

	// Add Listeners
	taskListeners(header, main, id);

	// For updating task timers
	const timer = header.querySelector(".time-after");
	timers.push(timer);

	container.appendChild(header);
	container.appendChild(main);
	parent.appendChild(container);
}

function tickProgress(goal, ticks, minimizeTick) {
	let progress = "";
	for (let i = 0; i < ticks.length; i++) {
		const tickDate = new Date(ticks[i]);
		const isNotToday = !(tickDate.getFullYear() === date.currentYear && tickDate.getMonth() === date.currentMonth && tickDate.getDate() === date.currentDay);

		if (isNotToday && minimizeTick) continue;
		progress += `<div class="tick ${isNotToday ? "tick-before" : ""}" data-tooltip="${dateFormat(tickDate)}"></div>`;
		if (goal) {
			if ((i + 1) % goal === 0) {
				progress += `<div class="tick-divider"></div>`;
			}
		}
	}
	return progress;
}

function taskToolbar(hasGoal, statFocused, tickMinimized) {
	const elGoal = hasGoal
		? ""
		: `<button class="goal-task" data-tooltip="Goal">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Zm300-440Zm86 160h134v-240H510l-16-80H280v240h290l16 80Z"/></svg>
			</button>`;
	return `<div class="task-toolbar">
			<button class="done-task" data-tooltip="Finish">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
			</button>       
			${elGoal}            
			<button class="focus-stat" style="${statFocused ? "background-color: light-dark(hsl(145, 60%, 40%), hsl(145, 55%, 40%))" : ""}" data-tooltip="Focus this task in stat">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-280h80v-200h-80v200Zm320 0h80v-400h-80v400Zm-160 0h80v-120h-80v120Zm0-200h80v-80h-80v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
			</button>            
			<button class="customize-task" data-tooltip="Customize">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z"/></svg>
			</button>
            <button class="minimize-tick" style="${tickMinimized ? "background-color: light-dark(hsl(145, 60%, 40%), hsl(145, 55%, 40%))" : ""}" data-tooltip="Minimize past ticks">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-440h400v-80H280v80Zm-80 320q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
            </button>
			<button class="down-task" data-tooltip="Down">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/></svg>
			</button>
			<button class="up-task" data-tooltip="Up">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg>
			</button>
			<button class="delete-task" data-tooltip="Delete">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
			</button>                        
		</div>`;
}

function taskHeader(title, description, createdAt, goal, ticks) {
	const time = ticks.length === 0 ? formatTimeAgo(new Date() - new Date(createdAt)) : formatTimeAgo(new Date() - new Date(ticks[ticks.length - 1]));
	const urlRegex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;
	description = description.replace(urlRegex, (match) => `<a href='${match}' target='_blank'>${match}</a>`);

	let goalProgress = "";
	if (goal) {
		goalProgress = `			
			<span class="ticks-count">/</span>
			<span class="ticks-count" data-hasgoal="true" contentEditable="false">${goal}</span>			
			<span data-tooltip="You've accomplished a total ${ticks.length} of this task!" class="ticks-count" style="color: hsl(0, 0%, 50%); font-size: 1rem;">${Math.floor(ticks.length / goal)}</span>
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
	const taskDone = header.querySelector(".done-task");
	const taskFocus = header.querySelector(".focus-stat");
	const taskDelete = header.querySelector(".delete-task");
	const taskGoal = header.querySelector(".goal-task");
	const taskUp = header.querySelector(".up-task");
	const taskDown = header.querySelector(".down-task");
	const goalEdit = header.querySelector("span[data-hasgoal='true']");
	const taskCustomize = header.querySelector(".customize-task");
	const tickAdd = main.querySelector(".tick-add");
	const tickDelete = main.querySelector(".tick-delete");
	const minimizeTick = header.querySelector(".minimize-tick");

	async function getSetTask(callback, id) {
		const { tasks } = await local.get("tasks");
		const index = tasks.findIndex((task) => task.id === id);
		if (index !== -1) {
			callback({ tasks, index, task: tasks[index] }); // JS passes objects by reference
			await local.set({ tasks }); // After operation, set the storage
		}
		return;
	}

	minimizeTick.addEventListener("click", () => {
		getSetTask(({ task }) => {
			task.minimizeTick = !task.minimizeTick;
		}, id);
	});

	taskFocus.addEventListener("click", () => {
		getSetTask(({ task }) => {
			task.statFocused = !task.statFocused;
		}, id);
	});

	taskDone.addEventListener("click", () => {
		getSetTask(({ task }) => {
			task.done = !task.done;
		}, id);
	});

	taskDelete.addEventListener("click", () => {
		getSetTask(({ tasks, index }) => {
			const isConfirmed = window.confirm("This action is permanent, proceed?");
			if (isConfirmed) {
				tasks.splice(index, 1);
				return;
			}
		}, id);
	});

	taskUp.addEventListener("click", () => {
		getSetTask(({ tasks, index }) => {
			if (index > 0) {
				for (let i = index - 1; i >= 0; i--) {
					if (!tasks[i].done) {
						[tasks[index], tasks[i]] = [tasks[i], tasks[index]];
						return;
					}
				}
			}
		}, id);
	});

	taskDown.addEventListener("click", () => {
		getSetTask(({ tasks, index }) => {
			if (index < tasks.length - 1) {
				for (let i = index + 1; i < tasks.length; i++) {
					if (!tasks[i].done) {
						[tasks[index], tasks[i]] = [tasks[i], tasks[index]];
						return;
					}
				}
			}
		}, id);
	});

	taskCustomize.addEventListener("click", () => {
		alert("Coming soon!");
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
			// Store shorter string? Maybe...
			task.ticks.push(String(new Date()));
		}, id);
	});

	infoListener(taskTitle, id);
	infoListener(taskDescription, id);
}
