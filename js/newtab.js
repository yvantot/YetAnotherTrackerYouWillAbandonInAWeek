const local = chrome.storage.local;
const date = new DateUtil(new Date());
let timers = [];
let yearChanger = 0;

function popupInit() {
	const urlSearchParam = new URLSearchParams(window.location.search);
	const tabType = urlSearchParam.get("mode");

	if (tabType === "popup") {
		insertPopupCSS();
	}
}

chrome.storage.onChanged.addListener(async () => {
	const userData = await local.get(null);

	timers = [];
	generateTasks(userData);

	const statFocusedTasks = userData.tasks.filter((task) => task.statFocused);
	if (statFocusedTasks.length > 0) {
		document.getElementById("reset-filter").classList.remove("hidden");
		generateStats(statFocusedTasks, date.currentYear);
	} else {
		document.getElementById("reset-filter").classList.add("hidden");
		generateStats(userData.tasks, date.currentYear);
	}
});

async function init() {
	const userData = await local.get(null);
	generateTasks(userData);

	const statFocusedTasks = userData.tasks.filter((task) => task.statFocused);
	if (statFocusedTasks.length > 0) {
		document.getElementById("reset-filter").classList.remove("hidden");
		generateStats(statFocusedTasks, date.currentYear);
	} else {
		document.getElementById("reset-filter").classList.add("hidden");
		generateStats(userData.tasks, date.currentYear);
	}

	popupInit();
	initListeners();
	initDisplay();
	toggleContainer(userData.settings);
}

function toggleContainer(settings) {
	if (settings && settings.visibility) {
		const { stat, list } = settings.visibility;
		const containers = document.querySelectorAll(".stats-container, .todolist-container");
		if (stat) {
			containers[0].classList.remove("hidden");
		}
		if (list) {
			containers[1].classList.remove("hidden");
		}
	}
}

init();
