const local = chrome.storage.local;
const date = new DateUtil(new Date());
let timers = [];

chrome.storage.onChanged.addListener(async () => {
	console.log("br");
	const userData = await local.get(null);

	timers = [];
	generateTasks(userData);
	generateStats(userData, date.currentYear);
});

async function init() {
	const userData = await local.get(null);

	generateTasks(userData);
	generateStats(userData, date.currentYear);
	initListeners();
	initDisplay();
}

function tickProgress(goal, ticks) {
	let progress = "";
	for (let i = 0; i < ticks.length; i++) {
		progress += `<div class="tick" title="${dateFormat(new Date(ticks[i]))}"></div>`;
		if (goal) {
			if ((i + 1) % goal === 0) {
				progress += `<div class="tick-divider"></div>`;
			}
		}
	}
	return progress;
}

function createTask(task) {
	const { id, ticks, title, description, createdAt, goal, done } = task;
	const parent = document.querySelector(".usertasks");
	const header = document.createElement("header");
	const main = document.createElement("div");
	const container = document.createElement("div");

	main.setAttribute("class", "tick-container");
	container.setAttribute("class", "usertask");

	header.innerHTML = `       
	   ${taskHeader(title, description, createdAt, goal, ticks)}
	   ${taskToolbar(goal)}
    `;

	main.innerHTML = `               
        <div class="tick-delete" ${ticks.length === 0 ? "style='display:none;'" : ""}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-440v-80h560v80H200Z"/></svg>
        </div>
        ${tickProgress(goal, ticks)}
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

init();
